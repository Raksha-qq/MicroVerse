const express = require("express");
const lessonsController = require("../controllers/lessons.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");
const { chapterSchema } = require("../validators/lessons.validator");

const router = express.Router();

router.get("/", optionalAuth, lessonsController.listChapters);
router.get("/:slugOrId", optionalAuth, lessonsController.getChapter);
router.post("/:id/complete", authenticate, lessonsController.completeChapter);

// Admin endpoints for chapters
router.post("/", authenticate, requireAdmin, validate(chapterSchema), lessonsController.createChapter);
router.put("/:id", authenticate, requireAdmin, validate(chapterSchema.partial()), lessonsController.updateChapter);
router.delete("/:id", authenticate, requireAdmin, lessonsController.deleteChapter);

module.exports = router;
