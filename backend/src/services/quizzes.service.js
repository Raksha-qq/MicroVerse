const prisma = require("../lib/prisma");

async function getQuizByChapter(chapterId) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      OR: [{ chapterId }, { id: chapterId }],
    },
    include: {
      chapter: {
        select: { id: true, title: true, chapterNumber: true },
      },
      questions: {
        select: {
          id: true,
          question: true,
          codeSnippet: true,
          options: true,
          points: true,
        },
      },
    },
  });

  if (!quiz) {
    const error = new Error("No assessment found for this curriculum unit.");
    error.statusCode = 404;
    throw error;
  }

  const formattedQuestions = quiz.questions.map((q) => ({
    ...q,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
  }));

  return {
    ...quiz,
    questions: formattedQuestions,
    totalPoints: formattedQuestions.reduce((sum, q) => sum + q.points, 0),
  };
}

async function submitQuiz(quizId, userId, answers) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    const error = new Error("Assessment not found.");
    error.statusCode = 404;
    throw error;
  }

  let earnedPoints = 0;
  let totalPoints = 0;
  const review = [];

  for (const q of quiz.questions) {
    totalPoints += q.points;
    const submittedIndex = answers[q.id];
    const isCorrect = submittedIndex === q.correctOptionIndex;

    if (isCorrect) {
      earnedPoints += q.points;
    }

    review.push({
      questionId: q.id,
      question: q.question,
      submittedOptionIndex: submittedIndex,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
      pointsEarned: isCorrect ? q.points : 0,
      maxPoints: q.points,
    });
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score: earnedPoints,
      totalPoints,
      passed,
      answers: JSON.stringify(answers),
    },
  });

  // Mark chapter completed if passed
  if (passed) {
    await prisma.userProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId: quiz.chapterId },
      },
      update: { isCompleted: true, completedAt: new Date() },
      create: {
        userId,
        chapterId: quiz.chapterId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Check for Silicon Scholar badge
    const completedCount = await prisma.userProgress.count({
      where: { userId, isCompleted: true },
    });
    if (completedCount >= 5) {
      const badge = await prisma.badge.findUnique({ where: { code: "SILICON_SCHOLAR" } });
      if (badge) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
          update: {},
          create: { userId, badgeId: badge.id },
        });
      }
    }
  }

  return {
    attemptId: attempt.id,
    score: earnedPoints,
    totalPoints,
    percentage,
    passed,
    passingScore: quiz.passingScore,
    review,
  };
}

async function addQuestion(data) {
  if (Array.isArray(data.options)) {
    data.options = JSON.stringify(data.options);
  }
  return await prisma.quizQuestion.create({ data });
}

module.exports = {
  getQuizByChapter,
  submitQuiz,
  addQuestion,
};

