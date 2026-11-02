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
    const user = await adminService.updateUserRole(req.params.id, role);
    return successResponse(res, user, "User security privileges updated.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMetrics,
  listUsers,
  updateUserRole,
};

