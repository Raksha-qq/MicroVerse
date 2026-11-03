require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET;

if (isProduction && !jwtSecret) {
  throw new Error("JWT_SECRET must be set in production.");
}

const config = {
  env: process.env.NODE_ENV || "development",
  isProduction,
  port: parseInt(process.env.PORT || "5000", 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/microverse?schema=public",
  jwt: {
    // Development fallback only. Production startup requires JWT_SECRET.
    secret:
      jwtSecret ||
      "local_development_only_change_this_secret_before_deployment_32_chars",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  cookie: {
    name: "microverse_session",
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || "300", 10),
    authMax: 20,
  },
};

module.exports = config;
