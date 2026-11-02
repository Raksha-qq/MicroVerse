const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");

const router = express.Router();

const submitSchema = z.object({
  answers: z.record(z.coerce.number().int()), // { [questionId]: chosenOptionIndex }
});

const quizQuestionSchema = z.object({
  quizId: z.string().uuid(),
  question: z.string().min(5),
  codeSnippet: z.string().nullable().optional(),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().nonnegative(),
  explanation: z.string().min(5),
  points: z.number().int().positive().default(10),
});

// GET /api/quizzes/chapter/:chapterId
router.get("/chapter/:chapterId", optionalAuth, async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { chapterId },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            codeSnippet: true,
            options: true,
            points: true,
            // NOTE: correctOptionIndex and explanation are deliberately omitted to prevent cheating!
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "No laboratory evaluation quiz associated with this chapter.",
      });
    }

    let userAttempts = [];
    if (req.user) {
      userAttempts = await prisma.quizAttempt.findMany({
        where: { userId: req.user.id, quizId: quiz.id },
        orderBy: { attemptedAt: "desc" },
        take: 5,
      });
    }

    const formattedQuestions = quiz.questions.map((q) => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    }));

    res.json({
      success: true,
      quiz: {
        id: quiz.id,
        chapterId: quiz.chapterId,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        questions: formattedQuestions,
      },
      userAttempts,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/quizzes/:id/submit (Server-side quiz evaluation)
router.post("/:id/submit", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = submitSchema.parse(req.body);

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found." });
    }

    let totalPossiblePoints = 0;
    let earnedPoints = 0;
    const evaluationResults = [];

    for (const q of quiz.questions) {
      totalPossiblePoints += q.points;
      const userSelected = answers[q.id];
      const isCorrect = userSelected !== undefined && userSelected === q.correctOptionIndex;

      if (isCorrect) {
        earnedPoints += q.points;
      }

      evaluationResults.push({
        questionId: q.id,
        userSelection: userSelected ?? null,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        pointsAwarded: isCorrect ? q.points : 0,
        explanation: q.explanation,
      });
    }

    const percentage =
      totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    // Record the attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: quiz.id,
        score: earnedPoints,
        totalPoints: totalPossiblePoints,
        passed,
        answers: JSON.stringify(answers),
      },
    });

    // If passed, mark associated chapter as complete!
    if (passed) {
      await prisma.userProgress.upsert({
        where: {
          userId_chapterId: {
            userId: req.user.id,
            chapterId: quiz.chapterId,
          },
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
        },
        create: {
          userId: req.user.id,
          chapterId: quiz.chapterId,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    // Check if 100% score for "Perfect Clock Cycle" / QUIZ_ACE badge
    let newBadgeUnlocked = null;
    if (percentage === 100) {
      const scholarBadge = await prisma.badge.findUnique({ where: { code: "SILICON_SCHOLAR" } });
      if (scholarBadge) {
        const existing = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId: req.user.id, badgeId: scholarBadge.id } },
        });
        if (!existing) {
          newBadgeUnlocked = scholarBadge;
          await prisma.userBadge.create({
            data: { userId: req.user.id, badgeId: scholarBadge.id },
          });
        }
      }
    }

    res.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score: earnedPoints,
        totalPoints: totalPossiblePoints,
        percentage,
        passingScore: quiz.passingScore,
        passed,
        evaluation: evaluationResults,
        newBadgeUnlocked,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Add question to quiz
router.post("/question", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const validated = quizQuestionSchema.parse(req.body);
    const created = await prisma.quizQuestion.create({
      data: {
        ...validated,
        options: JSON.stringify(validated.options),
      },
    });
    res.status(201).json({ success: true, question: created });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

