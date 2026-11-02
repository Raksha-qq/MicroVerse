const express = require("express");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalChapters,
      userProgress,
      quizAttempts,
      bookmarks,
      savedExperiments,
      userBadges,
      allBadges,
    ] = await Promise.all([
      prisma.chapter.count({ where: { isPublished: true } }),
      prisma.userProgress.findMany({
        where: { userId },
        include: { chapter: { select: { id: true, title: true, chapterNumber: true, slug: true } } },
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        include: { quiz: { select: { title: true, chapter: { select: { title: true, slug: true } } } } },
        orderBy: { attemptedAt: "desc" },
        take: 10,
      }),
      prisma.bookmark.findMany({
        where: { userId },
        include: { controller: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.savedExperiment.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
      }),
      prisma.badge.findMany(),
    ]);

    const completedChapters = userProgress.filter((p) => p.isCompleted);
    const progressPercentage =
      totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

    const totalQuizzesPassed = quizAttempts.filter((a) => a.passed).length;
    const avgScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) /
              quizAttempts.length
          )
        : 0;

    // Determine next recommended chapter
    const completedChapterNumbers = new Set(completedChapters.map((p) => p.chapter.chapterNumber));
    let nextChapterNumber = 1;
    while (completedChapterNumbers.has(nextChapterNumber) && nextChapterNumber <= totalChapters) {
      nextChapterNumber++;
    }

    const nextChapter = await prisma.chapter.findFirst({
      where: { chapterNumber: nextChapterNumber, isPublished: true },
      select: { id: true, chapterNumber: true, title: true, slug: true, summary: true, level: true },
    });

    const parsedExperiments = savedExperiments.map((exp) => ({
      ...exp,
      configState:
        typeof exp.configState === "string" ? JSON.parse(exp.configState) : exp.configState,
    }));

    const unlockedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
    const badgeGallery = allBadges.map((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        ...badge,
        isUnlocked: unlockedBadgeIds.has(badge.id),
        unlockedAt: userBadge ? userBadge.unlockedAt : null,
      };
    });

    res.json({
      success: true,
      stats: {
        totalChapters,
        completedCount: completedChapters.length,
        progressPercentage,
        quizStats: {
          totalAttempts: quizAttempts.length,
          passedCount: totalQuizzesPassed,
          averageScore: avgScore,
        },
        bookmarkCount: bookmarks.length,
        experimentCount: savedExperiments.length,
        nextChapter,
        recentAttempts: quizAttempts.map((a) => ({
          id: a.id,
          title: a.quiz.title,
          chapterTitle: a.quiz.chapter.title,
          score: a.score,
          totalPoints: a.totalPoints,
          percentage: Math.round((a.score / a.totalPoints) * 100),
          passed: a.passed,
          attemptedAt: a.attemptedAt,
        })),
        bookmarks,
        savedExperiments: parsedExperiments,
        badges: badgeGallery,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

