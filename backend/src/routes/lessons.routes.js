const express = require("express");
const lessonsController = require("../controllers/lessons.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");
const { lessonSchema, chapterSchema } = require("../validators/lessons.validator");

const router = express.Router();

// Lessons
router.get("/", optionalAuth, lessonsController.listLessons);
router.get("/:slugOrId", optionalAuth, lessonsController.getLesson);
router.post("/:id/complete", authenticate, lessonsController.completeLesson);

// Admin endpoints for lessons
router.post("/", authenticate, requireAdmin, validate(lessonSchema), lessonsController.createLesson);
router.put("/:id", authenticate, requireAdmin, validate(lessonSchema.partial()), lessonsController.updateLesson);
router.delete("/:id", authenticate, requireAdmin, lessonsController.deleteLesson);

module.exports = router;

