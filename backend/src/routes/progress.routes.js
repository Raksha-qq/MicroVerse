const express = require("express");
const progressController = require("../controllers/progress.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, progressController.getProgress);
router.post("/chapter/:chapterId", authenticate, progressController.markChapter);
router.post("/lesson/:lessonId", authenticate, progressController.markLesson);

module.exports = router;

