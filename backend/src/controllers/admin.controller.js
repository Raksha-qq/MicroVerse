const adminService = require("../services/admin.service");
const { successResponse } = require("../utilities/apiResponse");

async function getMetrics(req, res, next) {
  try {
    const metrics = await adminService.getMetrics();
    return successResponse(res, metrics, "Laboratory telemetry metrics retrieved.");
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await adminService.listUsers(req.query.search);
    return successResponse(res, users, "Registered engineers retrieved.");
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.user.id, req.params.id, role);
    return successResponse(res, user, "User security privileges updated.");
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await adminService.deleteUser(req.user.id, req.params.id);
    return successResponse(res, null, "User account successfully deleted.");
  } catch (error) {
    next(error);
  }
}

async function listControllers(req, res, next) {
  try {
    const list = await adminService.listAdminControllers();
    return successResponse(res, list, "All microcontrollers retrieved for admin management.");
  } catch (error) {
    next(error);
  }
}

async function listChapters(req, res, next) {
  try {
    const list = await adminService.listAdminChapters();
    return successResponse(res, list, "Curriculum chapters and lessons retrieved for admin management.");
  } catch (error) {
    next(error);
  }
}

async function listQuizzes(req, res, next) {
  try {
    const list = await adminService.listAdminQuizzes();
    return successResponse(res, list, "Assessments retrieved for admin management.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMetrics,
  listUsers,
  updateUserRole,
  deleteUser,
  listControllers,
  listChapters,
  listQuizzes,
};
