const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const config = require("../config");

async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check Bearer Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2. Check HTTP-Only Cookie
    else if (req.cookies && req.cookies[config.cookie.name]) {
      token = req.cookies[config.cookie.name];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please provide a valid session token or sign in.",
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authenticated user no longer exists in system.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Session token has expired. Please re-authenticate.",
      });
    }
    return res.status(401).json({
      success: false,
      error: "Invalid or malformed authentication token.",
    });
  }
}

// Optional authentication - doesn't reject if unauthenticated, but attaches req.user if valid token provided
async function optionalAuth(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies[config.cookie.name]) {
      token = req.cookies[config.cookie.name];
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          avatar: true,
        },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Silently continue without user
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Access forbidden: Elevated Administrator privileges required.",
    });
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
};
