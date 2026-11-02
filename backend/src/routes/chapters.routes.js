const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");

const router = express.Router();

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

// GET /api/chapters
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { isPublished: true },
      orderBy: { chapterNumber: "asc" },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        slug: true,
        summary: true,
        level: true,
        estimatedMinutes: true,
        keyTakeaways: true,
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
            _count: { select: { questions: true } },
          },
        },
      },
    });

    let completedChapterIds = new Set();
    if (req.user) {
      const progress = await prisma.userProgress.findMany({
        where: { userId: req.user.id, isCompleted: true },
        select: { chapterId: true },
      });
      completedChapterIds = new Set(progress.map((p) => p.chapterId));
    }

    const formatted = chapters.map((ch) => ({
      ...ch,
      keyTakeaways: typeof ch.keyTakeaways === "string" ? JSON.parse(ch.keyTakeaways) : ch.keyTakeaways,
      isCompleted: completedChapterIds.has(ch.id),
      hasQuiz: !!ch.quiz,
      questionCount: ch.quiz ? ch.quiz._count.questions : 0,
    }));

    res.json({
      success: true,
      chapters: formatted,
      totalCount: formatted.length,
      completedCount: completedChapterIds.size,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/chapters/:slug
router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const chapter = await prisma.chapter.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            passingScore: true,
            _count: { select: { questions: true } },
          },
        },
      },
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: "Curriculum chapter not found.",
      });
    }

    let isCompleted = false;
    let userQuizAttempt = null;

    if (req.user) {
      // Record last accessed
      await prisma.userProgress.upsert({
        where: {
          userId_chapterId: {
            userId: req.user.id,
            chapterId: chapter.id,
          },
        },
        update: { lastAccessedAt: new Date() },
        create: {
          userId: req.user.id,
          chapterId: chapter.id,
          isCompleted: false,
        },
      });

      const prog = await prisma.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: req.user.id,
            chapterId: chapter.id,
          },
        },
      });
      isCompleted = !!prog?.isCompleted;

      if (chapter.quiz) {
        userQuizAttempt = await prisma.quizAttempt.findFirst({
          where: {
            userId: req.user.id,
            quizId: chapter.quiz.id,
          },
          orderBy: { attemptedAt: "desc" },
          select: {
            id: true,
            score: true,
            totalPoints: true,
            passed: true,
            attemptedAt: true,
          },
        });
      }
    }

    res.json({
      success: true,
      chapter: {
        ...chapter,
        keyTakeaways:
          typeof chapter.keyTakeaways === "string" ? JSON.parse(chapter.keyTakeaways) : chapter.keyTakeaways,
        isCompleted,
        userQuizAttempt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/chapters/:id/complete
router.post("/:id/complete", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) {
      return res.status(404).json({ success: false, error: "Chapter not found." });
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: req.user.id,
          chapterId: id,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        chapterId: id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Check if user completed all published chapters
    const totalChapters = await prisma.chapter.count({ where: { isPublished: true } });
    const completedChapters = await prisma.userProgress.count({
      where: { userId: req.user.id, isCompleted: true },
    });

    let newBadgeUnlocked = null;
    if (completedChapters >= totalChapters) {
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
      message: "Curriculum chapter marked as completed.",
      progress,
      allCompleted: completedChapters >= totalChapters,
      newBadgeUnlocked,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/chapters (Admin only)
router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const validated = chapterSchema.parse(req.body);
    const dataToSave = {
      ...validated,
      keyTakeaways:
        typeof validated.keyTakeaways === "string"
          ? validated.keyTakeaways
          : JSON.stringify(validated.keyTakeaways),
    };

    const chapter = await prisma.chapter.create({ data: dataToSave });
    res.status(201).json({ success: true, chapter });
  } catch (error) {
    next(error);
  }
});

// PUT /api/chapters/:id (Admin only)
router.put("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = chapterSchema.partial().parse(req.body);
    const dataToUpdate = { ...validated };
    if (dataToUpdate.keyTakeaways && typeof dataToUpdate.keyTakeaways !== "string") {
      dataToUpdate.keyTakeaways = JSON.stringify(dataToUpdate.keyTakeaways);
    }

    const updated = await prisma.chapter.update({
      where: { id },
      data: dataToUpdate,
    });
    res.json({ success: true, chapter: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/chapters/:id (Admin only)
router.delete("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.chapter.delete({ where: { id } });
    res.json({ success: true, message: "Chapter deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

