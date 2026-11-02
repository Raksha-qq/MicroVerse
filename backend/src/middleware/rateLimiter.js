const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests dispatched to laboratory bus. Please wait before re-querying.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Excessive authentication attempts. Laboratory security cooldown active.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};

