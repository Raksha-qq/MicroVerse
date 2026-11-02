const prisma = require("../lib/prisma");

async function getUserProgress(userId) {
  const [chapterProgress, lessonProgress, totalChapters, totalLessons] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId },
      include: {
        chapter: {
          select: { id: true, chapterNumber: true, title: true, slug: true, level: true },
        },
      },
      orderBy: { chapter: { chapterNumber: "asc" } },
    }),
    prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: { id: true, lessonNumber: true, title: true, slug: true, estimatedMinutes: true },
        },
      },
    }),
    prisma.chapter.count({ where: { isPublished: true } }),
    prisma.lesson.count({ where: { isPublished: true } }),
  ]);

  const completedChapters = chapterProgress.filter((p) => p.isCompleted).length;
  const completedLessons = lessonProgress.filter((p) => p.isCompleted).length;

  return {
    chapters: {
      completed: completedChapters,
      total: totalChapters,
      percentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      details: chapterProgress,
    },
    lessons: {
      completed: completedLessons,
      total: totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      details: lessonProgress,
    },
  };
}

async function markChapterCompleted(userId, chapterId) {
  return await prisma.userProgress.upsert({
    where: {
      userId_chapterId: { userId, chapterId },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      chapterId,
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
  });
}

async function markLessonCompleted(userId, lessonId) {
  return await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
  });
}

module.exports = {
  getUserProgress,
  markChapterCompleted,
  markLessonCompleted,
};

