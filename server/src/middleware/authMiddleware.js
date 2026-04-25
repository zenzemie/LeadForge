const authMiddleware = (req, res, next) => {
  const authKey = process.env.API_AUTH_KEY;
  
  // If no key is set in ENV, we'll allow requests (optional, but good for local dev)
  if (!authKey) {
    return next();
  }

  const providedKey = req.headers['x-api-key'] || req.query.api_key;

  if (providedKey !== authKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
};

module.exports = authMiddleware;
