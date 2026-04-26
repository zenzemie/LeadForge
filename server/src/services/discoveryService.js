const axios = require('axios');
const cheerio = require('cheerio');

const YELP_API_KEY = process.env.YELP_API_KEY;

/**
 * Search for businesses using Yelp Fusion API
 */
const searchBusinesses = async (term, location) => {
  try {
    const response = await axios.get(
      'https://api.yelp.com/v3/businesses/search',
      {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          term: term,
          location: location,
          limit: 10,
        },
      }
    );
    return response.data.businesses;
  } catch (error) {
    console.error('Error in searchBusinesses (Yelp):', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Yelp Search returns most details already, so this is mainly for consistency
 * or if we need more specific details later.
 */
const getBusinessDetails = async (businessId) => {
  try {
    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in getBusinessDetails (Yelp):', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Basic email crawler for a given website
 */
const findEmailFromWebsite = async (url) => {
  if (!url) return null;
  
  // Basic URL validation/cleanup
  let cleanUrl = url;
  if (!url.startsWith('http')) {
    cleanUrl = `https://${url}`;
  }

  try {
    const response = await axios.get(cleanUrl, { 
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const bodyText = $('body').text();
    
    // Simple regex for email discovery
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = bodyText.match(emailRegex);
    
    if (matches && matches.length > 0) {
      // Return the first match (usually a contact email)
      return matches[0];
    }
    
    // Look for mailto links
    const mailto = $('a[href^="mailto:"]').attr('href');
    if (mailto) {
      return mailto.replace('mailto:', '').split('?')[0];
    }

    return null;
  } catch (error) {
    console.warn(`Could not crawl website ${url}:`, error.message);
    return null;
  }
};

/**
 * Calculate lead score based on Yelp data
 */
const calculateScore = (details) => {
  let score = 0;
  
  // No Website (+30) - Yelp usually has this, but if missing, it's a huge lead
  if (!details.url && !details.display_phone) {
    score += 40;
  } else if (!details.url) {
    score += 30;
  }

  // Low Review Count (+20) - Businesses with few reviews might need AI reply systems
  if (details.review_count < 20) {
    score += 20;
  }

  // High Rating but low volume (+10)
  if (details.rating >= 4 && details.review_count < 50) {
    score += 10;
  }

  return Math.min(score, 100);
};

module.exports = {
  searchBusinesses,
  getBusinessDetails,
  findEmailFromWebsite,
  calculateScore,
};
