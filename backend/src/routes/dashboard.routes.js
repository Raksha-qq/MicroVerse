const express = require("express");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      user,
      totalChapters,
      totalLessons,
      userProgress,
      lessonProgress,
      quizAttempts,
      bookmarks,
      savedExperiments,
      researchNotes,
      userBadges,
      allBadges,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, createdAt: true },
      }),
      prisma.chapter.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.userProgress.findMany({
        where: { userId },
        include: {
          chapter: {
            select: { id: true, title: true, chapterNumber: true, slug: true, summary: true, level: true },
          },
        },
        orderBy: { chapter: { chapterNumber: "asc" } },
      }),
      prisma.lessonProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            select: {
              id: true,
              lessonNumber: true,
              title: true,
              slug: true,
              estimatedMinutes: true,
              difficulty: true,
              chapter: { select: { id: true, title: true, slug: true, chapterNumber: true } },
            },
          },
        },
        orderBy: { lastAccessedAt: "desc" },
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              passingScore: true,
              chapter: { select: { title: true, slug: true, chapterNumber: true } },
            },
          },
        },
        orderBy: { attemptedAt: "desc" },
        take: 15,
      }),
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          controller: {
            select: {
              id: true,
              name: true,
              slug: true,
              commonName: true,
              family: true,
              architecture: true,
              bitWidth: true,
              maxClockSpeedMHz: true,
              flashKb: true,
              sramKb: true,
              manufacturer: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.savedExperiment.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.researchNote.findMany({
        where: { userId },
        include: {
          controller: { select: { id: true, name: true, slug: true } },
          chapter: { select: { id: true, title: true, slug: true } },
          lesson: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
      }),
      prisma.badge.findMany(),
    ]);

    const completedChapters = userProgress.filter((p) => p.isCompleted);
    const completedLessons = lessonProgress.filter((p) => p.isCompleted);

    const progressPercentage =
      totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;
    const lessonPercentage =
      totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

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

    // Recently visited lessons (for resuming)
    const recentlyVisitedLessons = lessonProgress.slice(0, 5).map((lp) => ({
      id: lp.lesson.id,
      title: lp.lesson.title,
      slug: lp.lesson.slug,
      lessonNumber: lp.lesson.lessonNumber,
      chapterTitle: lp.lesson.chapter.title,
      chapterSlug: lp.lesson.chapter.slug,
      isCompleted: lp.isCompleted,
      lastAccessedAt: lp.lastAccessedAt,
    }));

    const statsPayload = {
      user,
      totalChapters,
      totalLessons,
      completedCount: completedChapters.length,
      completedLessonsCount: completedLessons.length,
      progressPercentage,
      lessonPercentage,
      completedChapters: completedChapters.map((cp) => ({
        id: cp.chapter.id,
        chapterNumber: cp.chapter.chapterNumber,
        title: cp.chapter.title,
        slug: cp.chapter.slug,
        completedAt: cp.completedAt,
      })),
      recentlyVisitedLessons,
      quizStats: {
        totalAttempts: quizAttempts.length,
        passedCount: totalQuizzesPassed,
        averageScore: avgScore,
      },
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
      researchNotes,
      badges: badgeGallery,
      nextChapter,
      progress: {
        percentage: progressPercentage,
        completedLessons: completedLessons.length,
        totalLessons,
      },
    };

    res.json({
      success: true,
      stats: statsPayload,
      data: statsPayload,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
