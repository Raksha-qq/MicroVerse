const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const config = require("../config");

async function register(data) {
  const email = data.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("An account with this email address already exists in MICROVERSE.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: data.name.trim(),
      bio: data.bio || "Embedded Systems Explorer",
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

  // Award onboarding badge if exists
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
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return { token, user };
}

async function login(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      badges: {
        include: { badge: true },
      },
    },
  });

  if (!user) {
    const error = new Error("Invalid email or laboratory authentication token.");
    error.statusCode = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    const error = new Error("Invalid email or laboratory authentication token.");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
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

  return { token, user: safeUser };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      lessonProgress: {
        select: {
          lessonId: true,
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
          researchNotes: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error("User profile not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...user,
    badges: user.badges.map((b) => b.badge),
  };
}

async function updateProfile(userId, data) {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      bio: true,
      avatar: true,
    },
  });
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};

