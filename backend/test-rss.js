#!/usr/bin/env node

/**
 * Simple RSS test script for BizAI business sources
 * Run with: node test-rss.js
 */

import axios from 'axios';

const RSS_SOURCES = [
  { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/' }
];

async function testRSSFeed(source) {
  try {
    console.log(`\n🧪 Testing ${source.name}...`);
    
    const response = await axios.get(source.url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'BizAI-NewsAggregator/1.0 (Educational Purpose)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });
    
    if (response.status === 200) {
      const contentLength = response.data.length;
      const hasItems = response.data.includes('<item>') || response.data.includes('<entry>');
      
      console.log(`✅ ${source.name}: Status ${response.status}`);
      console.log(`   Content length: ${contentLength} bytes`);
      console.log(`   Contains items: ${hasItems ? 'Yes' : 'No'}`);
      
      if (hasItems) {
        // Count items
        const itemMatches = response.data.match(/<item[^>]*>/g);
        const itemCount = itemMatches ? itemMatches.length : 0;
        console.log(`   Article count: ${itemCount}`);
      }
    } else {
      console.log(`⚠️ ${source.name}: Unexpected status ${response.status}`);
    }
    
  } catch (error) {
    console.log(`❌ ${source.name}: ${error.response?.status || 'Network Error'} - ${error.message}`);
  }
}

async function testAllFeeds() {
  console.log('🚀 BizAI RSS Feed Tests');
  console.log('======================');
  
  for (const source of RSS_SOURCES) {
    await testRSSFeed(source);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 RSS feed tests completed!');
  console.log('\nNote: Some feeds may be blocked or require specific headers.');
  console.log('The application will gracefully fall back to homepage links.');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAllFeeds().catch(console.error);
}

export { testAllFeeds };