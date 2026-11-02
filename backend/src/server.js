require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Route modules
const authRoutes = require("./routes/auth.routes");
const controllersRoutes = require("./routes/controllers.routes");
const chaptersRoutes = require("./routes/chapters.routes");
const quizzesRoutes = require("./routes/quizzes.routes");
const experimentsRoutes = require("./routes/experiments.routes");
const bookmarksRoutes = require("./routes/bookmarks.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Apply global rate limiting to all API routes
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    laboratory: "MICROVERSE Embedded Intelligence Engine",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/controllers", controllersRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/experiments", experimentsRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Laboratory resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  MICROVERSE: Embedded Laboratory Server ONLINE`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=======================================================`);
});

module.exports = app;

