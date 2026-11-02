const quizzesService = require("../services/quizzes.service");
const { successResponse } = require("../utilities/apiResponse");

async function getByChapter(req, res, next) {
  try {
    const quiz = await quizzesService.getQuizByChapter(req.params.chapterId);
    return successResponse(res, quiz, "Assessment retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

async function submit(req, res, next) {
  try {
    const { answers } = req.body;
    const result = await quizzesService.submitQuiz(req.params.id, req.user.id, answers);
    return successResponse(res, result, "Assessment evaluated.");
  } catch (error) {
    next(error);
  }
}

async function addQuestion(req, res, next) {
  try {
    const created = await quizzesService.addQuestion(req.body);
    return successResponse(res, created, "Question added to assessment.", 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getByChapter,
  submit,
  addQuestion,
};

