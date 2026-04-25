const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Stricter limiter for heavy discovery/email tasks
const heavyTaskLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 heavy requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Heavy task limit reached. Please wait an hour.'
  }
});

module.exports = {
  apiLimiter,
  heavyTaskLimiter
};
