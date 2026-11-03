const prisma = require("../lib/prisma");

async function getMetrics() {
  const [
    userCount,
    controllerCount,
    chapterCount,
    lessonCount,
    quizCount,
    attemptCount,
    experimentCount,
    noteCount,
    recentAttempts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.controller.count(),
    prisma.chapter.count(),
    prisma.lesson.count(),
    prisma.quiz.count(),
    prisma.quizAttempt.count(),
    prisma.savedExperiment.count(),
    prisma.researchNote.count(),
    prisma.quizAttempt.findMany({
      take: 10,
      orderBy: { attemptedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        quiz: { select: { id: true, title: true } },
      },
    }),
  ]);

  return {
    totals: {
      users: userCount,
      controllers: controllerCount,
      chapters: chapterCount,
      lessons: lessonCount,
      quizzes: quizCount,
      quizAttempts: attemptCount,
      savedExperiments: experimentCount,
      researchNotes: noteCount,
    },
    totalUsers: userCount,
    totalControllers: controllerCount,
    totalChapters: chapterCount,
    totalLessons: lessonCount,
    totalQuizzes: quizCount,
    totalQuizAttempts: attemptCount,
    totalExperiments: experimentCount,
    totalResearchNotes: noteCount,
    recentAttempts,
  };
}

async function listUsers(search = "") {
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
      _count: {
        select: {
          progress: true,
          lessonProgress: true,
          attempts: true,
          savedExperiments: true,
          researchNotes: true,
          bookmarks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function updateUserRole(callerId, targetUserId, role) {
  if (callerId === targetUserId && role !== "ADMIN") {
    const error = new Error("Administrators cannot demote themselves.");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.user.update({
    where: { id: targetUserId },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

async function deleteUser(callerId, targetUserId) {
  if (callerId === targetUserId) {
    const error = new Error("Administrators cannot delete their own active account.");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.user.delete({
    where: { id: targetUserId },
  });
}

async function listAdminControllers() {
  return await prisma.controller.findMany({
    orderBy: [{ family: "asc" }, { name: "asc" }],
  });
}

async function listAdminChapters() {
  return await prisma.chapter.findMany({
    include: {
      lessons: {
        orderBy: { lessonNumber: "asc" },
      },
      quiz: {
        include: {
          _count: { select: { questions: true } },
        },
      },
    },
    orderBy: { chapterNumber: "asc" },
  });
}

async function listAdminQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      chapter: { select: { id: true, chapterNumber: true, title: true } },
      questions: true,
      _count: { select: { attempts: true } },
    },
    orderBy: { chapter: { chapterNumber: "asc" } },
  });

  return quizzes.map((q) => ({
    ...q,
    questions: q.questions.map((qn) => ({
      ...qn,
      options: typeof qn.options === "string" ? JSON.parse(qn.options) : qn.options,
    })),
  }));
}

module.exports = {
  getMetrics,
  listUsers,
  updateUserRole,
  deleteUser,
  listAdminControllers,
  listAdminChapters,
  listAdminQuizzes,
};
