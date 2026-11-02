const lessonsService = require("../services/lessons.service");
const progressService = require("../services/progress.service");
const { successResponse } = require("../utilities/apiResponse");

async function listLessons(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const isAdmin = req.user?.role === "ADMIN";
    const lessons = await lessonsService.listLessons(userId, req.query, isAdmin);
    return successResponse(res, lessons, "Curriculum lessons retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

async function getLesson(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const isAdmin = req.user?.role === "ADMIN";
    const lesson = await lessonsService.getLessonBySlugOrId(req.params.slugOrId, userId, isAdmin);
    return successResponse(res, lesson, "Curriculum lesson retrieved.");
  } catch (error) {
    next(error);
  }
}

async function getRelated(req, res, next) {
  try {
    const related = await lessonsService.getRelatedLessons(req.params.slugOrId);
    return successResponse(res, related, "Related curriculum lessons retrieved.");
  } catch (error) {
    next(error);
  }
}

async function completeLesson(req, res, next) {
  try {
    const progress = await progressService.markLessonCompleted(req.user.id, req.params.id);
    return successResponse(res, progress, "Lesson marked as completed.");
  } catch (error) {
    next(error);
  }
}

async function listChapters(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const isAdmin = req.user?.role === "ADMIN";
    const chapters = await lessonsService.listChapters(userId, isAdmin);
    return successResponse(res, chapters, "Curriculum chapters retrieved successfully.");
  } catch (error) {
    next(error);
  }
}

async function getChapter(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const isAdmin = req.user?.role === "ADMIN";
    const chapter = await lessonsService.getChapterBySlugOrId(req.params.slugOrId, userId, isAdmin);
    return successResponse(res, chapter, "Curriculum chapter retrieved.");
  } catch (error) {
    next(error);
  }
}

async function completeChapter(req, res, next) {
  try {
    const progress = await progressService.markChapterCompleted(req.user.id, req.params.id);
    return successResponse(res, progress, "Chapter marked as completed.");
  } catch (error) {
    next(error);
  }
}

async function createLesson(req, res, next) {
  try {
    const created = await lessonsService.createLesson(req.body);
    return successResponse(res, created, "Curriculum lesson created.", 201);
  } catch (error) {
    next(error);
  }
}

async function updateLesson(req, res, next) {
  try {
    const updated = await lessonsService.updateLesson(req.params.id, req.body);
    return successResponse(res, updated, "Curriculum lesson updated.");
  } catch (error) {
    next(error);
  }
}

async function deleteLesson(req, res, next) {
  try {
    await lessonsService.deleteLesson(req.params.id);
    return successResponse(res, null, "Curriculum lesson deleted.");
  } catch (error) {
    next(error);
  }
}

async function createChapter(req, res, next) {
  try {
    const created = await lessonsService.createChapter(req.body);
    return successResponse(res, created, "Curriculum chapter created.", 201);
  } catch (error) {
    next(error);
  }
}

async function updateChapter(req, res, next) {
  try {
    const updated = await lessonsService.updateChapter(req.params.id, req.body);
    return successResponse(res, updated, "Curriculum chapter updated.");
  } catch (error) {
    next(error);
  }
}

async function deleteChapter(req, res, next) {
  try {
    await lessonsService.deleteChapter(req.params.id);
    return successResponse(res, null, "Curriculum chapter deleted.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listLessons,
  getLesson,
  getRelated,
  completeLesson,
  listChapters,
  getChapter,
  completeChapter,
  createLesson,
  updateLesson,
  deleteLesson,
  createChapter,
  updateChapter,
  deleteChapter,
};
