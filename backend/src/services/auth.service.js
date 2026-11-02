const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const config = require("../config");

async function register(data) {
  const email = data.email.toLowerCase().trim();

  // 1. Check duplicate email
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    const error = new Error("An account with this email address already exists in MICROVERSE.");
    error.statusCode = 409;
    throw error;
  }

  // 2. Resolve or check username
  let username = data.username ? data.username.toLowerCase().trim() : null;
  if (username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      const error = new Error("This engineering handle (username) is already claimed.");
      error.statusCode = 409;
      throw error;
    }
  } else {
    // Generate deterministic default username from email
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const existing = await prisma.user.findUnique({ where: { username: baseUsername } });
    username = existing ? `${baseUsername}_${Date.now().toString().slice(-4)}` : baseUsername;
  }

  // 3. Hash password using bcrypt (10 rounds)
  const passwordHash = await bcrypt.hash(data.password, 10);

  // 4. Create user with role explicitly set to 'USER' (prevent unauthorized role escalation)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      name: data.name.trim(),
      bio: data.bio || "Embedded Systems Explorer",
      role: "USER", // NEVER TRUST USER INPUT FOR ROLE
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      bio: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
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

  // 5. Sign JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return { token, user };
}

async function login(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email or handle
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { username: normalizedEmail },
      ],
    },
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

  // Verify bcrypt hash
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

  // Clean, sanitized user profile (NEVER RETURN PASSWORD HASH)
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
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
      username: true,
      name: true,
      role: true,
      bio: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
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
  // If username is being changed, ensure uniqueness
  if (data.username) {
    const existing = await prisma.user.findFirst({
      where: {
        username: data.username.toLowerCase().trim(),
        NOT: { id: userId },
      },
    });
    if (existing) {
      const error = new Error("This username is already taken.");
      error.statusCode = 409;
      throw error;
    }
    data.username = data.username.toLowerCase().trim();
  }

  // Permitted updates only (NEVER ALLOW ESCALATING ROLE OR MODIFIYING PASSWORD HASH DIRECTLY)
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.username !== undefined) updateData.username = data.username;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      bio: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
