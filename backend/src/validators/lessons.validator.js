const { z } = require("zod");

const lessonSchema = z.object({
  chapterId: z.string().uuid("Valid chapter UUID required"),
  lessonNumber: z.coerce.number().int().positive(),
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(20),
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
  lessonSchema,
  chapterSchema,
};

