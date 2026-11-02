const bookmarksService = require("../services/bookmarks.service");
const { successResponse } = require("../utilities/apiResponse");

async function list(req, res, next) {
  try {
    const bookmarks = await bookmarksService.getUserBookmarks(req.user.id);
    return successResponse(res, bookmarks, "Bookmarks retrieved.");
  } catch (error) {
    next(error);
  }
}

async function toggle(req, res, next) {
  try {
    const { itemType, itemId } = req.body;
    const result = await bookmarksService.toggleBookmark(req.user.id, itemType, itemId);
    return successResponse(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await bookmarksService.removeBookmark(req.user.id, req.params.id);
    return successResponse(res, result, "Bookmark deleted.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  toggle,
  remove,
};

