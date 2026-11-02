const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  console.error("[MICROVERSE ERROR]", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Input validation failed.",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: `Conflict: A unique constraint violation occurred on ${err.meta?.target || "field"}.`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "Requested database record was not found.",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error occurred in laboratory engine.";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;

