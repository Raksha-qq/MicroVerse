const controllersService = require("../services/controllers.service");
const { successResponse } = require("../utilities/apiResponse");

async function list(req, res, next) {
  try {
    const result = await controllersService.listControllers(req.query);
    return successResponse(
      res,
      result.controllers,
      "Microcontrollers retrieved successfully.",
      200,
      result.meta
    );
  } catch (error) {
    next(error);
  }
}

async function featured(req, res, next) {
  try {
    const controllers = await controllersService.getFeaturedControllers();
    return successResponse(res, controllers, "Featured microcontrollers retrieved.");
  } catch (error) {
    next(error);
  }
}

async function getByIdOrSlug(req, res, next) {
  try {
    const controller = await controllersService.getControllerByIdOrSlug(req.params.idOrSlug);
    return successResponse(res, controller, "Microcontroller specification retrieved.");
  } catch (error) {
    next(error);
  }
}

async function getRelated(req, res, next) {
  try {
    const related = await controllersService.getRelatedControllers(req.params.idOrSlug);
    return successResponse(res, related, "Related microcontrollers retrieved.");
  } catch (error) {
    next(error);
  }
}

async function compare(req, res, next) {
  try {
    const ids = req.query.ids ? req.query.ids.split(",").map((s) => s.trim()) : [];
    const controllers = await controllersService.compareControllers(ids);
    return successResponse(res, controllers, "Controller comparison set retrieved.");
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const created = await controllersService.createController(req.body);
    return successResponse(res, created, "Microcontroller registered into catalog.", 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const updated = await controllersService.updateController(req.params.id, req.body);
    return successResponse(res, updated, "Microcontroller specification updated.");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await controllersService.deleteController(req.params.id);
    return successResponse(res, null, "Microcontroller removed from catalog.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  featured,
  getByIdOrSlug,
  getRelated,
  compare,
  create,
  update,
  remove,
};
