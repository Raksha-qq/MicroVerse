const express = require("express");

const authRoutes = require("./auth.routes");
const controllersRoutes = require("./controllers.routes");
const lessonsRoutes = require("./lessons.routes");
const chaptersRoutes = require("./chapters.routes");
const quizzesRoutes = require("./quizzes.routes");
const progressRoutes = require("./progress.routes");
const bookmarksRoutes = require("./bookmarks.routes");
const experimentsRoutes = require("./experiments.routes");
const researchNotesRoutes = require("./researchNotes.routes");
const dashboardRoutes = require("./dashboard.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/controllers", controllersRoutes);
router.use("/lessons", lessonsRoutes);
router.use("/chapters", chaptersRoutes);
router.use("/quizzes", quizzesRoutes);
router.use("/progress", progressRoutes);
router.use("/bookmarks", bookmarksRoutes);
router.use("/experiments", experimentsRoutes);
router.use("/research-notes", researchNotesRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

