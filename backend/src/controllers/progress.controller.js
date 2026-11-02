const progressService = require("../services/progress.service");
const { successResponse } = require("../utilities/apiResponse");

async function getProgress(req, res, next) {
  try {
    const progress = await progressService.getUserProgress(req.user.id);
    return successResponse(res, progress, "Curriculum progress retrieved.");
  } catch (error) {
    next(error);
  }
}

async function markChapter(req, res, next) {
  try {
    const result = await progressService.markChapterCompleted(req.user.id, req.params.chapterId);
    return successResponse(res, result, "Chapter marked as completed.");
  } catch (error) {
    next(error);
  }
}

async function markLesson(req, res, next) {
  try {
    const result = await progressService.markLessonCompleted(req.user.id, req.params.lessonId);
    return successResponse(res, result, "Lesson marked as completed.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProgress,
  markChapter,
  markLesson,
};

