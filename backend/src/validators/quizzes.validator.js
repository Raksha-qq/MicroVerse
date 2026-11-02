const { z } = require("zod");

const submitQuizSchema = z.object({
  answers: z.record(z.coerce.number().int()), // questionId -> optionIndex
});

const questionSchema = z.object({
  quizId: z.string().uuid(),
  question: z.string().min(5),
  codeSnippet: z.string().optional().nullable(),
  options: z.array(z.string().min(1)).min(2),
  correctOptionIndex: z.coerce.number().int().min(0),
  explanation: z.string().min(5),
  points: z.coerce.number().int().positive().default(10),
});

module.exports = {
  submitQuizSchema,
  questionSchema,
};

