import axios from 'axios';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const linkCache = new Map();

export async function verifyLink(url) {
  // Check cache first
  const cached = linkCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isValid;
  }

  try {
    // Use HEAD request to check if link is accessible
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: (status) => status < 500, // Accept redirects and client errors
      headers: {
        'User-Agent': 'BizAI-LinkChecker/1.0 (Educational Purpose)'
      }
    });

    const isValid = response.status >= 200 && response.status < 400;
    
    // Cache the result
    linkCache.set(url, {
      isValid,
      timestamp: Date.now(),
      status: response.status
    });

    return isValid;
  } catch (error) {
    // If HEAD fails, try GET with limited data
    try {
      const response = await axios.get(url, {
        timeout: 3000,
        maxRedirects: 2,
        responseType: 'stream',
        headers: {
          'User-Agent': 'BizAI-LinkChecker/1.0 (Educational Purpose)',
          'Range': 'bytes=0-1023' // Only get first 1KB
        }
      });

      const isValid = response.status >= 200 && response.status < 400;
      
      // Destroy the stream to prevent memory leaks
      response.data.destroy();
      
      linkCache.set(url, {
        isValid,
        timestamp: Date.now(),
        status: response.status
      });

      return isValid;
    } catch (secondError) {
      // Cache as invalid
      linkCache.set(url, {
        isValid: false,
        timestamp: Date.now(),
        status: 0,
        error: secondError.message
      });

      return false;
    }
  }
}

export async function verifyMultipleLinks(urls) {
  const results = await Promise.allSettled(
    urls.map(async (url) => ({
      url,
      isValid: await verifyLink(url)
    }))
  );

  return results.map(result => 
    result.status === 'fulfilled' ? result.value : { url: '', isValid: false }
  );
}

export function clearLinkCache() {
  linkCache.clear();
}

export function getLinkCacheStats() {
  return {
    size: linkCache.size,
    entries: Array.from(linkCache.entries()).map(([url, data]) => ({
      url,
      isValid: data.isValid,
      cachedAt: new Date(data.timestamp).toISOString(),
      status: data.status
    }))
  };
}