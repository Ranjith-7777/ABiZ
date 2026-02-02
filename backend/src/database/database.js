import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = join(__dirname, '../../data/bizai.db');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source_name TEXT NOT NULL,
        summary TEXT,
        url TEXT NOT NULL,
        image_url TEXT,
        published_at TEXT NOT NULL,
        read_minutes INTEGER DEFAULT 3,
        domains TEXT, -- JSON array as string
        api_source TEXT,
        link_valid BOOLEAN,
        is_generated BOOLEAN DEFAULT 0,
        credibility_score INTEGER,
        validation_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createFetchLogsTable = `
      CREATE TABLE IF NOT EXISTS fetch_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_name TEXT NOT NULL,
        endpoint_name TEXT NOT NULL,
        articles_count INTEGER DEFAULT 0,
        success BOOLEAN DEFAULT 1,
        error_message TEXT,
        fetch_duration_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at)',
      'CREATE INDEX IF NOT EXISTS idx_articles_api_source ON articles(api_source)',
      'CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_fetch_logs_created_at ON fetch_logs(created_at)'
    ];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createArticlesTable, (err) => {
          if (err) {
            console.error('Error creating articles table:', err);
            reject(err);
            return;
          }
        });

        this.db.run(createFetchLogsTable, (err) => {
          if (err) {
            console.error('Error creating fetch_logs table:', err);
            reject(err);
            return;
          }
        });

        // Create indexes
        createIndexes.forEach(indexSQL => {
          this.db.run(indexSQL, (err) => {
            if (err) {
              console.error('Error creating index:', err);
            }
          });
        });

        console.log('✅ Database tables created/verified');
        resolve();
      });
    });
  }

  async saveArticles(articles) {
    if (!articles || articles.length === 0) return 0;

    const insertSQL = `
      INSERT OR REPLACE INTO articles (
        id, title, source_name, summary, url, image_url, published_at,
        read_minutes, domains, api_source, link_valid, is_generated,
        credibility_score, validation_status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(insertSQL);
      let savedCount = 0;
      let errors = 0;

      articles.forEach((article) => {
        const domains = JSON.stringify(article.domains || []);
        
        stmt.run([
          article.id,
          article.title,
          article.sourceName,
          article.summary,
          article.url,
          article.imageUrl,
          article.publishedAt,
          article.readMinutes || 3,
          domains,
          article.apiSource,
          article.linkValid,
          article.isGenerated ? 1 : 0,
          article.credibilityScore,
          article.validationStatus || 'pending'
        ], function(err) {
          if (err) {
            console.error('Error saving article:', err);
            errors++;
          } else {
            savedCount++;
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`💾 Saved ${savedCount} articles to database (${errors} errors)`);
          resolve(savedCount);
        }
      });
    });
  }

  async getRecentArticles(limit = 30, maxAgeHours = 24) {
    const sql = `
      SELECT * FROM articles 
      WHERE created_at > datetime('now', '-${maxAgeHours} hours')
      ORDER BY published_at DESC, created_at DESC
      LIMIT ?
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const articles = rows.map(row => ({
            id: row.id,
            title: row.title,
            sourceName: row.source_name,
            summary: row.summary,
            url: row.url,
            imageUrl: row.image_url,
            publishedAt: row.published_at,
            readMinutes: row.read_minutes,
            domains: JSON.parse(row.domains || '[]'),
            apiSource: row.api_source,
            linkValid: row.link_valid,
            isGenerated: row.is_generated === 1,
            credibilityScore: row.credibility_score,
            validationStatus: row.validation_status
          }));
          resolve(articles);
        }
      });
    });
  }

  async getArticleCount() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM articles', (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  async getLastFetchTime() {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT MAX(created_at) as last_fetch FROM fetch_logs WHERE success = 1',
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.last_fetch);
          }
        }
      );
    });
  }

  async logFetch(apiName, endpointName, articlesCount, success, errorMessage = null, duration = 0) {
    const sql = `
      INSERT INTO fetch_logs (api_name, endpoint_name, articles_count, success, error_message, fetch_duration_ms)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [apiName, endpointName, articlesCount, success ? 1 : 0, errorMessage, duration], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async cleanupOldArticles(maxAgeHours = 72) {
    const sql = `DELETE FROM articles WHERE created_at < datetime('now', '-${maxAgeHours} hours')`;
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`🧹 Cleaned up ${this.changes} old articles (older than ${maxAgeHours}h)`);
          resolve(this.changes);
        }
      });
    });
  }

  async getStats() {
    const queries = [
      'SELECT COUNT(*) as total_articles FROM articles',
      'SELECT COUNT(DISTINCT api_source) as api_sources FROM articles',
      'SELECT COUNT(DISTINCT source_name) as news_sources FROM articles',
      'SELECT COUNT(*) as recent_articles FROM articles WHERE created_at > datetime("now", "-24 hours")',
      'SELECT api_source, COUNT(*) as count FROM articles GROUP BY api_source',
      'SELECT AVG(credibility_score) as avg_credibility FROM articles WHERE credibility_score IS NOT NULL'
    ];

    const stats = {};

    for (const query of queries) {
      try {
        const result = await new Promise((resolve, reject) => {
          this.db.all(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        if (query.includes('GROUP BY')) {
          stats.apiDistribution = result.reduce((acc, row) => {
            acc[row.api_source] = row.count;
            return acc;
          }, {});
        } else {
          Object.assign(stats, result[0]);
        }
      } catch (error) {
        console.error('Error getting stats:', error);
      }
    }

    return stats;
  }

  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('📴 Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Create singleton instance
const database = new Database();

export default database;