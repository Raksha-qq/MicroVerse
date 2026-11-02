const { z } = require("zod");

const updateProgressSchema = z.object({
  isCompleted: z.boolean().default(true),
});

module.exports = {
  updateProgressSchema,
};

