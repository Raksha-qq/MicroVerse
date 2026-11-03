const { z } = require("zod");

const researchNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(5, "Research note content is required"),
  category: z.enum(["ARCHITECTURE", "PERIPHERAL", "PROTOCOL", "EXPERIMENT", "ROBOTICS", "GENERAL"]).default("GENERAL"),
  tags: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  controllerId: z.string().uuid().optional().nullable(),
  chapterId: z.string().uuid().optional().nullable(),
  lessonId: z.string().uuid().optional().nullable(),
  isPublic: z.boolean().default(false),
});

module.exports = {
  researchNoteSchema,
};

