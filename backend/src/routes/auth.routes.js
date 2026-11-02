const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "microverse_default_fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const registerSchema = z.object({
  email: z.string().email("Valid engineering email address is required"),
  password: z.string().min(8, "Security passphrase must be at least 8 characters"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

// POST /api/auth/register
router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists in MICROVERSE.",
      });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        name: validated.name.trim(),
        bio: validated.bio || "Embedded Systems Explorer",
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Auto-award initial badge
    const ignitionBadge = await prisma.badge.findUnique({
      where: { code: "FIRST_EXPERIMENT" },
    });
    if (ignitionBadge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: ignitionBadge.id,
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Microverse engineer credentials registered successfully.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        badges: {
          include: { badge: true },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or laboratory authentication token.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or laboratory authentication token.",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      badges: user.badges.map((b) => b.badge),
    };

    res.json({
      success: true,
      message: "Session authenticated successfully.",
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        badges: {
          include: { badge: true },
        },
        progress: {
          select: {
            chapterId: true,
            isCompleted: true,
            completedAt: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            itemType: true,
            itemId: true,
          },
        },
        _count: {
          select: {
            savedExperiments: true,
            attempts: true,
            bookmarks: true,
          },
        },
      },
    });

    res.json({
      success: true,
      user: {
        ...user,
        badges: user.badges.map((b) => b.badge),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile
router.put("/profile", authenticate, async (req, res, next) => {
  try {
    const validated = profileUpdateSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: validated,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
      },
    });

    res.json({
      success: true,
      message: "Laboratory engineer profile updated.",
      user: updated,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

