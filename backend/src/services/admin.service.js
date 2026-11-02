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
      createdAt: true,
      _count: {
        select: {
          progress: true,
          lessonProgress: true,
          attempts: true,
          savedExperiments: true,
          researchNotes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function updateUserRole(userId, role) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

module.exports = {
  getMetrics,
  listUsers,
  updateUserRole,
};

