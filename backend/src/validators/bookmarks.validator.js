const { z } = require("zod");

const toggleBookmarkSchema = z.object({
  itemType: z.enum(["CONTROLLER", "CHAPTER", "LESSON", "EXPERIMENT", "ROBOTICS"]),
  itemId: z.string().uuid("Item ID must be a valid UUID"),
});

module.exports = {
  toggleBookmarkSchema,
};

