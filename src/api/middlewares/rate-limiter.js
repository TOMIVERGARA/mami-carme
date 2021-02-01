const rateLimit = require('express-rate-limit');

module.exports = rateLimiter = rateLimit({
  windowMs: 30000, // 24 hrs in milliseconds
  max: 100,
  message: 'You have exceeded the 100 requests in 30s window limit!',
  headers: true,
});