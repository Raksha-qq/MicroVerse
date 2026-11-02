const prisma = require("../lib/prisma");

async function listLessons(userId = null) {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: [{ chapter: { chapterNumber: "asc" } }, { order: "asc" }],
    include: {
      chapter: {
        select: {
          id: true,
          chapterNumber: true,
          title: true,
          slug: true,
          level: true,
        },
      },
    },
  });

  let completedLessonIds = new Set();
  if (userId) {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId, isCompleted: true },
      select: { lessonId: true },
    });
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  return lessons.map((l) => ({
    ...l,
    isCompleted: completedLessonIds.has(l.id),
  }));
}

async function getLessonBySlugOrId(identifier, userId = null) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ slug: identifier }, { id: identifier }],
    },
    include: {
      chapter: {
        select: {
          id: true,
          chapterNumber: true,
          title: true,
          slug: true,
          level: true,
        },
      },
      researchNotes: {
        where: { isPublic: true },
        select: {
          id: true,
          title: true,
          category: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!lesson) {
    const error = new Error("Lesson not found in curriculum.");
    error.statusCode = 404;
    throw error;
  }

  let isCompleted = false;
  if (userId) {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
    });
    isCompleted = !!progress?.isCompleted;
  }

  return { ...lesson, isCompleted };
}

async function listChapters(userId = null) {
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
      lessons: {
        where: { isPublished: true },
        select: {
          id: true,
          lessonNumber: true,
          title: true,
          slug: true,
          estimatedMinutes: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
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
  if (userId) {
    const progress = await prisma.userProgress.findMany({
      where: { userId, isCompleted: true },
      select: { chapterId: true },
    });
    completedChapterIds = new Set(progress.map((p) => p.chapterId));
  }

  return chapters.map((ch) => ({
    ...ch,
    keyTakeaways: typeof ch.keyTakeaways === "string" ? JSON.parse(ch.keyTakeaways) : ch.keyTakeaways,
    isCompleted: completedChapterIds.has(ch.id),
    hasQuiz: !!ch.quiz,
    questionCount: ch.quiz ? ch.quiz._count.questions : 0,
  }));
}

async function getChapterBySlugOrId(identifier, userId = null) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      OR: [{ slug: identifier }, { id: identifier }],
    },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
      },
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
    const error = new Error("Curriculum chapter not found.");
    error.statusCode = 404;
    throw error;
  }

  let isCompleted = false;
  if (userId) {
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: { userId, chapterId: chapter.id },
      },
    });
    isCompleted = !!progress?.isCompleted;
  }

  return {
    ...chapter,
    keyTakeaways: typeof chapter.keyTakeaways === "string" ? JSON.parse(chapter.keyTakeaways) : chapter.keyTakeaways,
    isCompleted,
  };
}

async function createLesson(data) {
  return await prisma.lesson.create({ data });
}

async function updateLesson(id, data) {
  return await prisma.lesson.update({
    where: { id },
    data,
  });
}

async function deleteLesson(id) {
  return await prisma.lesson.delete({
    where: { id },
  });
}

async function createChapter(data) {
  if (Array.isArray(data.keyTakeaways)) {
    data.keyTakeaways = JSON.stringify(data.keyTakeaways);
  }
  return await prisma.chapter.create({ data });
}

async function updateChapter(id, data) {
  if (Array.isArray(data.keyTakeaways)) {
    data.keyTakeaways = JSON.stringify(data.keyTakeaways);
  }
  return await prisma.chapter.update({
    where: { id },
    data,
  });
}

async function deleteChapter(id) {
  return await prisma.chapter.delete({
    where: { id },
  });
}

module.exports = {
  listLessons,
  getLessonBySlugOrId,
  listChapters,
  getChapterBySlugOrId,
  createLesson,
  updateLesson,
  deleteLesson,
  createChapter,
  updateChapter,
  deleteChapter,
};

