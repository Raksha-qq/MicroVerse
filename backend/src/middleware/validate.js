/**
 * Reusable Zod Validation Middleware
 */
const { ZodError } = require("zod");

const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const validated = schema.parse(req[source]);
    req[source] = validated;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed for incoming laboratory payload.",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = validate;

