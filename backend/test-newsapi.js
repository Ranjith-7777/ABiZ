#!/usr/bin/env node

/**
 * NewsAPI Integration Test Script for BizAI
 * Run with: node test-newsapi.js
 */

import axios from 'axios';

const NEWSAPI_KEY = 'f0d29ac5d9e443418bbbc438df6853c0';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

const TEST_ENDPOINTS = [
  {
    name: 'Business Headlines',
    endpoint: '/top-headlines',
    params: {
      category: 'business',
      language: 'en',
      pageSize: 5
    }
  },
  {
    name: 'Everything Business',
    endpoint: '/everything',
    params: {
      q: 'business OR finance',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 5,
      from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  {
    name: 'Technology News',
    endpoint: '/everything',
    params: {
      q: 'technology OR AI',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 3,
      from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
];

async function testNewsAPIEndpoint(config) {
  try {
    console.log(`\n🧪 Testing ${config.name}...`);
    
    const response = await axios.get(`${NEWSAPI_BASE_URL}${config.endpoint}`, {
      params: {
        ...config.params,
        apiKey: NEWSAPI_KEY
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'BizAI/1.0'
      }
    });
    
    if (response.status === 200 && response.data) {
      console.log(`✅ ${config.name}: Status ${response.status}`);
      console.log(`   Total Results: ${response.data.totalResults || 0}`);
      console.log(`   Articles Returned: ${response.data.articles?.length || 0}`);
      
      if (response.data.articles && response.data.articles.length > 0) {
        const firstArticle = response.data.articles[0];
        console.log(`   Sample Article:`);
        console.log(`     Title: ${firstArticle.title?.substring(0, 60)}...`);
        console.log(`     Source: ${firstArticle.source?.name}`);
        console.log(`     Published: ${firstArticle.publishedAt}`);
        console.log(`     URL: ${firstArticle.url ? 'Available' : 'Missing'}`);
        console.log(`     Image: ${firstArticle.urlToImage ? 'Available' : 'Missing'}`);
        
        // Check for removed articles
        const removedCount = response.data.articles.filter(a => 
          a.title?.includes('[Removed]') || a.source?.name === '[Removed]'
        ).length;
        
        if (removedCount > 0) {
          console.log(`   ⚠️ Removed Articles: ${removedCount}`);
        }
      }
    } else {
      console.log(`⚠️ ${config.name}: Unexpected response structure`);
    }
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ ${config.name}: HTTP ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
      console.log(`   Code: ${error.response.data?.code || 'N/A'}`);
    } else {
      console.log(`❌ ${config.name}: ${error.message}`);
    }
  }
}

async function testNewsAPIKey() {
  console.log('🔑 Testing NewsAPI Key Validity...');
  
  try {
    const response = await axios.get(`${NEWSAPI_BASE_URL}/top-headlines`, {
      params: {
        category: 'general',
        language: 'en',
        pageSize: 1,
        apiKey: NEWSAPI_KEY
      },
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ NewsAPI Key is valid and working');
      return true;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ NewsAPI Key is invalid or expired');
    } else if (error.response?.status === 429) {
      console.log('⚠️ NewsAPI rate limit exceeded');
    } else {
      console.log(`❌ NewsAPI Key test failed: ${error.message}`);
    }
    return false;
  }
}

async function runNewsAPITests() {
  console.log('🚀 BizAI NewsAPI Integration Tests');
  console.log('==================================');
  console.log(`API Key: ${NEWSAPI_KEY.substring(0, 8)}...${NEWSAPI_KEY.substring(-4)}`);
  console.log(`Base URL: ${NEWSAPI_BASE_URL}`);
  
  // Test API key first
  const keyValid = await testNewsAPIKey();
  
  if (!keyValid) {
    console.log('\n❌ Cannot proceed with endpoint tests - API key issues');
    return;
  }
  
  // Test each endpoint
  for (const config of TEST_ENDPOINTS) {
    await testNewsAPIEndpoint(config);
    // Small delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 NewsAPI tests completed!');
  console.log('\nNote: NewsAPI has rate limits and some articles may be [Removed]');
  console.log('The application includes robust fallback mechanisms.');
  console.log('\nNewsAPI Documentation: https://newsapi.org/docs');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runNewsAPITests().catch(console.error);
}

export { runNewsAPITests };