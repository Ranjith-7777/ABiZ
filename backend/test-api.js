#!/usr/bin/env node

/**
 * Simple API test script for BizAI backend
 * Run with: node test-api.js
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const API_URL = `${BASE_URL}/api`;

async function testEndpoint(name, url, method = 'GET', data = null) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const config = { method, url: `${API_URL}${url}` };
    if (data) config.data = data;
    
    const response = await axios(config);
    console.log(`✅ ${name}: Status ${response.status}`);
    
    if (response.data) {
      if (typeof response.data === 'object') {
        console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
      } else {
        console.log(`   Response: ${response.data}`);
      }
    }
    
    return response.data;
  } catch (error) {
    console.log(`❌ ${name}: ${error.response?.status || 'Network Error'} - ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 BizAI Backend API Tests');
  console.log('==========================');
  
  // Basic endpoints
  await testEndpoint('Health Check', '/health');
  await testEndpoint('Daily Briefing', '/news/daily-briefing');
  await testEndpoint('Enhanced Briefing', '/news/daily-briefing?enhanced=true');
  await testEndpoint('Daily Quiz', '/quiz/daily');
  await testEndpoint('AI Quiz', '/quiz/daily?ai=true');
  await testEndpoint('Market Data', '/market');
  await testEndpoint('Eco Metrics', '/eco');
  await testEndpoint('Saved Articles', '/saved');
  
  // Link verification
  await testEndpoint('Verify Link', '/verify/link', 'POST', { 
    url: 'https://www.google.com' 
  });
  
  await testEndpoint('Verify Multiple Links', '/verify/links', 'POST', { 
    urls: ['https://www.google.com', 'https://www.github.com'] 
  });
  
  await testEndpoint('Verification Stats', '/verify/stats');
  
  // AI endpoints (will fail gracefully if no API key)
  await testEndpoint('Validate Article', '/ai/validate-article', 'POST', {
    article: {
      title: 'Test Article',
      sourceName: 'Test Source',
      summary: 'This is a test article summary',
      url: 'https://example.com'
    }
  });
  
  console.log('\n🎉 API tests completed!');
  console.log('\nNote: Some tests may fail if API keys are not configured.');
  console.log('This is expected behavior with graceful fallbacks.');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };