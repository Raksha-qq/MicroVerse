const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "microverse_default_fallback_secret";

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication token missing or invalid format (Bearer token expected).",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
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
      error: "Invalid security token.",
    });
  }
}

// Optional authentication - doesn't fail if no token, but attaches req.user if valid token provided
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true, avatar: true },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid optional tokens
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

