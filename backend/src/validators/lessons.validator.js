const { z } = require("zod");

const lessonQuerySchema = z.object({
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  chapterId: z.string().uuid().optional(),
  search: z.string().optional(),
  includeDrafts: z.enum(["true", "false"]).optional(),
});

const lessonSchema = z.object({
  chapterId: z.string().uuid("Valid chapter UUID required"),
  lessonNumber: z.coerce.number().int().positive(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  estimatedMinutes: z.coerce.number().int().positive().default(15),
  order: z.coerce.number().int().default(1),
  isPublished: z.boolean().default(true),
});

const chapterSchema = z.object({
  chapterNumber: z.coerce.number().int().positive(),
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedMinutes: z.coerce.number().int().positive(),
  content: z.string().min(20),
  keyTakeaways: z.array(z.string()).or(z.string()),
  isPublished: z.boolean().default(true),
});

module.exports = {
  lessonQuerySchema,
  lessonSchema,
  chapterSchema,
};
