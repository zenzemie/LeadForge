const axios = require('axios');
const cheerio = require('cheerio');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Search for businesses using Google Places Text Search
 */
const searchPlaces = async (query) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: query,
          key: GOOGLE_PLACES_API_KEY,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error in searchPlaces:', error.message);
    throw error;
  }
};

/**
 * Fetch detailed information for a specific place
 */
const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          fields: 'name,formatted_phone_number,website,rating,user_ratings_total,types,business_status',
          key: GOOGLE_PLACES_API_KEY,
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error('Error in getPlaceDetails:', error.message);
    throw error;
  }
};

/**
 * Basic email crawler for a given website
 */
const findEmailFromWebsite = async (url) => {
  if (!url) return null;
  try {
    const response = await axios.get(url, { 
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
      // Filter out common false positives if any, return the first one
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
 * Calculate lead score based on strategy
 */
const calculateScore = (details) => {
  let score = 0;
  
  // No Website (+30)
  if (!details.website) {
    score += 30;
  } else {
    // Has website but might need redesign (could add more complex checks here)
    // For now, let's just assume if they have a website it's good, but if it's missing it's a huge opportunity.
  }

  // No Chatbot/WhatsApp (+25) - Hard to detect via API, but we'll assume most don't have one if not specified
  score += 25; 

  // Public Email Listed (+15) - Handled after crawling
  
  // High Review Volume (+10)
  if (details.user_ratings_total > 100) {
    score += 10;
  }

  return Math.min(score, 100);
};

module.exports = {
  searchPlaces,
  getPlaceDetails,
  findEmailFromWebsite,
  calculateScore,
};
