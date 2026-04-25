const jwt = require('jsonwebtoken');
const config = require('../../config');

class SecurityService {
  constructor() {
    this.secret = config.jwtSecret;
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: '1d' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = SecurityService;
