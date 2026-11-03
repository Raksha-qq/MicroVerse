const { z } = require("zod");

const toggleBookmarkSchema = z.object({
  itemType: z.enum(["CONTROLLER", "CHAPTER", "LESSON", "EXPERIMENT", "ROBOTICS"]),
  itemId: z.string().min(1, "Item ID is required"),
});

module.exports = {
  toggleBookmarkSchema,
};

