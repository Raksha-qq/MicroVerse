const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const roleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

// GET /api/admin/metrics
router.get("/metrics", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [
      userCount,
      controllerCount,
      chapterCount,
      quizAttemptCount,
      experimentCount,
      recentUsers,
      recentAttempts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.controller.count(),
      prisma.chapter.count(),
      prisma.quizAttempt.count(),
      prisma.savedExperiment.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.quizAttempt.findMany({
        take: 5,
        orderBy: { attemptedAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          quiz: { select: { title: true } },
        },
      }),
    ]);

    const passedAttempts = await prisma.quizAttempt.count({ where: { passed: true } });
    const globalPassRate =
      quizAttemptCount > 0 ? Math.round((passedAttempts / quizAttemptCount) * 100) : 0;

    res.json({
      success: true,
      metrics: {
        userCount,
        controllerCount,
        chapterCount,
        quizAttemptCount,
        experimentCount,
        globalPassRate,
        recentUsers,
        recentAttempts: recentAttempts.map((a) => ({
          id: a.id,
          userName: a.user.name,
          userEmail: a.user.email,
          quizTitle: a.quiz.title,
          score: a.score,
          totalPoints: a.totalPoints,
          passed: a.passed,
          attemptedAt: a.attemptedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users
router.get("/users", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            progress: true,
            attempts: true,
            savedExperiments: true,
            bookmarks: true,
          },
        },
      },
    });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id/role
router.put("/users/:id/role", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = roleSchema.parse(req.body);

    // Prevent admin from removing their own admin status
    if (id === req.user.id && role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        error: "Cannot revoke own Administrator privileges.",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({
      success: true,
      message: `User privileges updated to ${role}.`,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

