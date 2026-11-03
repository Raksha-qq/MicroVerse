const express = require("express");
const quizzesController = require("../controllers/quizzes.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");
const { submitQuizSchema, questionSchema, quizSchema } = require("../validators/quizzes.validator");

const router = express.Router();

router.get("/", optionalAuth, quizzesController.list);
router.get("/attempts", authenticate, quizzesController.attempts);
router.get("/chapter/:chapterId", quizzesController.getByChapter);
router.get("/:id", quizzesController.getById);
router.post("/:id/submit", authenticate, validate(submitQuizSchema), quizzesController.submit);

// Admin-only assessment management
router.post("/", authenticate, requireAdmin, quizzesController.create);
router.put("/:id", authenticate, requireAdmin, quizzesController.update);
router.delete("/:id", authenticate, requireAdmin, quizzesController.remove);

// Admin-only question management
router.post("/question", authenticate, requireAdmin, validate(questionSchema), quizzesController.addQuestion);
router.put("/questions/:id", authenticate, requireAdmin, quizzesController.updateQuestion);
router.delete("/questions/:id", authenticate, requireAdmin, quizzesController.removeQuestion);

module.exports = router;
