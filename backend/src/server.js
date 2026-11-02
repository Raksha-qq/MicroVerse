const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const config = require("./config");
const prisma = require("./lib/prisma");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utilities/logger");

const app = express();

// Security & Parsing Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (config.env !== "test") {
  app.use(morgan("dev"));
}

// Health Check Endpoint (Accessible at both /api/health and /api/v1/health)
const healthHandler = async (req, res) => {
  let dbStatus = "DISCONNECTED";
  let dbLatencyMs = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbStatus = "CONNECTED";
  } catch (err) {
    logger.error("Database health check ping failed:", err.message);
  }

  const isHealthy = dbStatus === "CONNECTED";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ONLINE" : "DEGRADED",
    laboratory: "MICROVERSE Embedded Intelligence Engine",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.env,
    database: {
      status: dbStatus,
      engine: "PostgreSQL",
      latencyMs: dbLatencyMs,
    },
    subsystems: {
      auth: "OPERATIONAL",
      controllers: "OPERATIONAL",
      curriculum: "OPERATIONAL",
      simulation: "OPERATIONAL",
      researchNotebook: "OPERATIONAL",
    },
  });
};

app.get("/api/health", healthHandler);
app.get("/api/v1/health", healthHandler);

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Mount central API router under both /api and /api/v1 (API versioning)
app.use("/api", routes);
app.use("/api/v1", routes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Laboratory resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(config.port, () => {
    logger.info(`=======================================================`);
    logger.info(`  MICROVERSE: Embedded Laboratory Engine ONLINE`);
    logger.info(`  URL: http://localhost:${config.port}`);
    logger.info(`  API: http://localhost:${config.port}/api`);
    logger.info(`  Environment: ${config.env}`);
    logger.info(`=======================================================`);
  });
}

module.exports = app;
