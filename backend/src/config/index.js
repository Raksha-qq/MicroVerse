require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "5000", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/microverse?schema=public",
  jwt: {
    secret: process.env.JWT_SECRET || "microverse_development_secret_key_replace_in_production_environment_32chars",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  cookie: {
    name: "microverse_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.includes(",")
        ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
        : process.env.CORS_ORIGIN
      : "http://localhost:5173",
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "300", 10),
    authMax: 20, // 20 attempts per window for auth routes
  },
};

module.exports = config;
