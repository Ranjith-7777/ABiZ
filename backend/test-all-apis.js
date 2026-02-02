#!/usr/bin/env node

/**
 * Multi-API Integration Test Script for BizAI
 * Tests NewsAPI.org, GNews API, NewsData.io, and TheNewsAPI.com
 * Run with: node test-all-apis.js
 */

import axios from 'axios';

// API Keys (you'll need to get these from respective services)
const API_KEYS = {
    NEWSAPI_KEY: 'f0d29ac5d9e443418bbbc438df6853c0',
    GNEWS_API_KEY: '8715f5baba0d68449fcd29d3739b492c', // Get from https://gnews.io/
    NEWSDATA_API_KEY: 'pub_f644e2ed0a1346929dd76874fa9ebe4d', // Get from https://newsdata.io/
    THENEWSAPI_KEY: '623eb06c35904e54bfcdac6d7c3bfad5' // Get from https://www.thenewsapi.com/
};

const NEWS_APIS = [{
        name: 'NewsAPI.org',
        enabled: !!API_KEYS.NEWSAPI_KEY && API_KEYS.NEWSAPI_KEY !== 'your_newsapi_key_here',
        website: 'https://newsapi.org/',
        endpoints: [{
            name: 'Business Headlines',
            url: 'https://newsapi.org/v2/top-headlines',
            params: {
                category: 'business',
                language: 'en',
                pageSize: 5,
                apiKey: API_KEYS.NEWSAPI_KEY
            }
        }]
    },
    {
        name: 'GNews API',
        enabled: !!API_KEYS.GNEWS_API_KEY && API_KEYS.GNEWS_API_KEY !== 'your_gnews_api_key_here',
        website: 'https://gnews.io/',
        endpoints: [{
            name: 'Business News',
            url: 'https://gnews.io/api/v4/top-headlines',
            params: {
                category: 'business',
                lang: 'en',
                country: 'us',
                max: 5,
                apikey: API_KEYS.GNEWS_API_KEY
            }
        }]
    },
    {
        name: 'NewsData.io',
        enabled: !!API_KEYS.NEWSDATA_API_KEY && API_KEYS.NEWSDATA_API_KEY !== 'your_newsdata_api_key_here',
        website: 'https://newsdata.io/',
        endpoints: [{
            name: 'Business Headlines',
            url: 'https://newsdata.io/api/1/news',
            params: {
                apikey: API_KEYS.NEWSDATA_API_KEY,
                category: 'business',
                language: 'en',
                size: 5
            }
        }]
    },
    {
        name: 'TheNewsAPI.com',
        enabled: !!API_KEYS.THENEWSAPI_KEY && API_KEYS.THENEWSAPI_KEY !== 'your_thenewsapi_key_here',
        website: 'https://www.thenewsapi.com/',
        endpoints: [{
            name: 'Business News',
            url: 'https://api.thenewsapi.com/v1/news/top',
            params: {
                api_token: API_KEYS.THENEWSAPI_KEY,
                categories: 'business',
                language: 'en',
                limit: 5
            }
        }]
    }
];

async function testAPIEndpoint(api, endpoint) {
    try {
        console.log(`    🧪 Testing ${endpoint.name}...`);

        const response = await axios.get(endpoint.url, {
            params: endpoint.params,
            timeout: 10000,
            headers: {
                'User-Agent': 'BizAI/1.0 (Educational Purpose)',
                'Accept': 'application/json'
            }
        });

        if (response.status === 200 && response.data) {
            // Parse response based on API structure
            let articles = [];
            let totalResults = 0;

            switch (api.name) {
                case 'NewsAPI.org':
                    articles = response.data.articles || [];
                    totalResults = response.data.totalResults || 0;
                    break;
                case 'GNews API':
                    articles = response.data.articles || [];
                    totalResults = response.data.totalArticles || 0;
                    break;
                case 'NewsData.io':
                    articles = response.data.results || [];
                    totalResults = response.data.totalResults || 0;
                    break;
                case 'TheNewsAPI.com':
                    articles = response.data.data || [];
                    totalResults = response.data.meta ? .found || 0;
                    break;
            }

            console.log(`      ✅ Status: ${response.status}`);
            console.log(`      📊 Total Results: ${totalResults}`);
            console.log(`      📰 Articles Returned: ${articles.length}`);

            if (articles.length > 0) {
                const firstArticle = articles[0];
                console.log(`      📄 Sample Article:`);

                // Extract title based on API structure
                const title = firstArticle.title || 'No title';
                const source = firstArticle.source ? .name || firstArticle.source_id || firstArticle.source || 'Unknown';
                const url = firstArticle.url || firstArticle.link || 'No URL';

                console.log(`        Title: ${title.substring(0, 60)}...`);
                console.log(`        Source: ${source}`);
                console.log(`        URL: ${url ? 'Available' : 'Missing'}`);

                // Check for removed/invalid articles
                const validArticles = articles.filter(a =>
                    a.title &&
                    !a.title.includes('[Removed]') &&
                    (a.url || a.link)
                );

                console.log(`      ✅ Valid Articles: ${validArticles.length}/${articles.length}`);
            }

            return { success: true, articlesCount: articles.length };
        } else {
            console.log(`      ⚠️ Unexpected response structure`);
            return { success: false, error: 'Invalid response structure' };
        }

    } catch (error) {
        if (error.response) {
            console.log(`      ❌ HTTP ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
            if (error.response.status === 401) {
                console.log(`      🔑 Check your API key for ${api.name}`);
            } else if (error.response.status === 429) {
                console.log(`      ⏰ Rate limit exceeded for ${api.name}`);
            }
        } else {
            console.log(`      ❌ Network Error: ${error.message}`);
        }
        return { success: false, error: error.message };
    }
}

async function testAPI(api) {
    console.log(`\n📡 Testing ${api.name}`);
    console.log(`   Website: ${api.website}`);

    if (!api.enabled) {
        console.log(`   ⚠️ API key not configured - skipping tests`);
        console.log(`   💡 Get your API key from: ${api.website}`);
        return { api: api.name, enabled: false, results: [] };
    }

    console.log(`   🔑 API key configured: ✅`);

    const results = [];
    for (const endpoint of api.endpoints) {
        const result = await testAPIEndpoint(api, endpoint);
        results.push({ endpoint: endpoint.name, ...result });

        // Small delay between endpoint tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { api: api.name, enabled: true, results };
}

async function runAllAPITests() {
    console.log('🚀 BizAI Multi-API Integration Tests');
    console.log('====================================');
    console.log('Testing 4 news APIs for comprehensive coverage:\n');

    const allResults = [];

    for (const api of NEWS_APIS) {
        const result = await testAPI(api);
        allResults.push(result);

        // Delay between API tests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Summary
    console.log('\n📊 SUMMARY');
    console.log('===========');

    let totalConfigured = 0;
    let totalWorking = 0;
    let totalArticles = 0;

    allResults.forEach(result => {
        if (result.enabled) {
            totalConfigured++;
            const workingEndpoints = result.results.filter(r => r.success).length;
            const articles = result.results.reduce((sum, r) => sum + (r.articlesCount || 0), 0);

            if (workingEndpoints > 0) {
                totalWorking++;
                totalArticles += articles;
            }

            console.log(`${result.api}: ${workingEndpoints > 0 ? '✅' : '❌'} (${articles} articles)`);
        } else {
            console.log(`${result.api}: ⚠️ Not configured`);
        }
    });

    console.log(`\n🎯 Results:`);
    console.log(`   APIs Configured: ${totalConfigured}/4`);
    console.log(`   APIs Working: ${totalWorking}/${totalConfigured}`);
    console.log(`   Total Articles: ${totalArticles}`);

    if (totalWorking === 0) {
        console.log(`\n❌ No APIs are working! Please check your API keys.`);
        console.log(`\n📝 To get API keys:`);
        console.log(`   • NewsAPI.org: https://newsapi.org/register`);
        console.log(`   • GNews API: https://gnews.io/register`);
        console.log(`   • NewsData.io: https://newsdata.io/register`);
        console.log(`   • TheNewsAPI.com: https://www.thenewsapi.com/register`);
    } else {
        console.log(`\n✅ Multi-API integration is working!`);
        console.log(`   The application will aggregate news from ${totalWorking} sources.`);
    }

    console.log(`\n🎉 Tests completed!`);
}

// Run tests if this script is executed directly
if (
    import.meta.url === `file://${process.argv[1]}`) {
    runAllAPITests().catch(console.error);
}

export { runAllAPITests };