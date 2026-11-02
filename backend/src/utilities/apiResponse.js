/**
 * Standardized API response format helpers for MICROVERSE
 */

function successResponse(res, data = null, message = "Operation completed successfully", statusCode = 200, meta = null) {
  const payload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
  };
  return res.status(statusCode).json(payload);
}

function errorResponse(res, message = "Internal laboratory error", statusCode = 500, details = null) {
  const payload = {
    success: false,
    error: message,
    ...(details && { details }),
  };
  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};

