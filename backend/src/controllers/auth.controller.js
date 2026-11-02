const authService = require("../services/auth.service");
const { successResponse } = require("../utilities/apiResponse");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, "Microverse engineer credentials registered successfully.", 201);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, result, "Session authenticated successfully.");
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.id);
    return successResponse(res, { user: profile }, "Current engineer profile retrieved.");
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updated = await authService.updateProfile(req.user.id, req.body);
    return successResponse(res, { user: updated }, "Laboratory engineer profile updated.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};

