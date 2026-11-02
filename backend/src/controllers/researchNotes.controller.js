const researchNotesService = require("../services/researchNotes.service");
const { successResponse } = require("../utilities/apiResponse");

async function list(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const notes = await researchNotesService.listResearchNotes(userId, req.query);
    return successResponse(res, notes, "Research notes retrieved.");
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const note = await researchNotesService.getResearchNoteById(req.params.id, userId);
    return successResponse(res, note, "Research note retrieved.");
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const created = await researchNotesService.createResearchNote(req.user.id, req.body);
    return successResponse(res, created, "Research note logged successfully.", 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const updated = await researchNotesService.updateResearchNote(req.user.id, req.params.id, req.body);
    return successResponse(res, updated, "Research note updated.");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await researchNotesService.deleteResearchNote(req.user.id, req.params.id);
    return successResponse(res, null, "Research note archived.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

