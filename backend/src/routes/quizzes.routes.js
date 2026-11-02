const express = require("express");
const quizzesController = require("../controllers/quizzes.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { submitQuizSchema, questionSchema } = require("../validators/quizzes.validator");

const router = express.Router();

router.get("/chapter/:chapterId", quizzesController.getByChapter);
router.post("/:id/submit", authenticate, validate(submitQuizSchema), quizzesController.submit);

// Admin-only question creation
router.post("/question", authenticate, requireAdmin, validate(questionSchema), quizzesController.addQuestion);

module.exports = router;
