const experimentsService = require("../services/experiments.service");
const { successResponse } = require("../utilities/apiResponse");

async function list(req, res, next) {
  try {
    const experiments = await experimentsService.getUserExperiments(req.user.id);
    return successResponse(res, experiments, "Laboratory experiments retrieved.");
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const experiment = await experimentsService.getExperimentById(req.user.id, req.params.id);
    return successResponse(res, experiment, "Experiment configuration loaded.");
  } catch (error) {
    next(error);
  }
}

async function save(req, res, next) {
  try {
    const saved = await experimentsService.saveExperiment(req.user.id, req.body);
    return successResponse(res, saved, "Laboratory experiment configuration saved.", 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const updated = await experimentsService.updateExperiment(req.user.id, req.params.id, req.body);
    return successResponse(res, updated, "Laboratory experiment updated.");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await experimentsService.deleteExperiment(req.user.id, req.params.id);
    return successResponse(res, null, "Laboratory experiment removed.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  save,
  update,
  remove,
};

