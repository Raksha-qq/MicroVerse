const quizzesService = require("../services/quizzes.service");
const { successResponse } = require("../utilities/apiResponse");

async function list(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const quizzes = await quizzesService.listAllQuizzes(userId);
    return successResponse(res, quizzes, "Quizzes retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

async function attempts(req, res, next) {
  try {
    const list = await quizzesService.getUserAttempts(req.user.id);
    return successResponse(res, list, "Quiz attempts retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const quiz = await quizzesService.getQuizById(req.params.id);
    return successResponse(res, quiz, "Assessment retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

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

async function create(req, res, next) {
  try {
    const created = await quizzesService.createQuiz(req.body);
    return successResponse(res, created, "Quiz created.", 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const updated = await quizzesService.updateQuiz(req.params.id, req.body);
    return successResponse(res, updated, "Quiz updated.");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await quizzesService.deleteQuiz(req.params.id);
    return successResponse(res, null, "Quiz deleted.");
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

async function updateQuestion(req, res, next) {
  try {
    const updated = await quizzesService.updateQuestion(req.params.id, req.body);
    return successResponse(res, updated, "Question updated.");
  } catch (error) {
    next(error);
  }
}

async function removeQuestion(req, res, next) {
  try {
    await quizzesService.deleteQuestion(req.params.id);
    return successResponse(res, null, "Question removed.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  attempts,
  getById,
  getByChapter,
  submit,
  create,
  update,
  remove,
  addQuestion,
  updateQuestion,
  removeQuestion,
};
