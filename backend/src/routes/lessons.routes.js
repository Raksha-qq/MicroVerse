const express = require("express");
const lessonsController = require("../controllers/lessons.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");
const {
  lessonQuerySchema,
  lessonSchema,
} = require("../validators/lessons.validator");

const router = express.Router();

router.get("/", optionalAuth, validate(lessonQuerySchema, "query"), lessonsController.listLessons);
router.get("/:slugOrId", optionalAuth, lessonsController.getLesson);
router.get("/:slugOrId/related", optionalAuth, lessonsController.getRelated);
router.post("/:id/complete", authenticate, lessonsController.completeLesson);

// Admin-only management endpoints
router.post("/", authenticate, requireAdmin, validate(lessonSchema), lessonsController.createLesson);
router.put("/:id", authenticate, requireAdmin, validate(lessonSchema.partial()), lessonsController.updateLesson);
router.delete("/:id", authenticate, requireAdmin, lessonsController.deleteLesson);

module.exports = router;
