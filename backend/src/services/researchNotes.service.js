const prisma = require("../lib/prisma");

async function listResearchNotes(userId = null, filters = {}) {
  const { category, search, publicOnly = false } = filters;

  const where = {};

  if (publicOnly || !userId) {
    where.isPublic = true;
  } else {
    // Current user's notes OR public notes
    where.OR = [
      { userId },
      { isPublic: true },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (search) {
    where.AND = [
      {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { contains: search, mode: "insensitive" } },
        ],
      },
    ];
  }

  return await prisma.researchNote.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
      controller: {
        select: { id: true, name: true, commonName: true },
      },
      chapter: {
        select: { id: true, chapterNumber: true, title: true },
      },
      lesson: {
        select: { id: true, lessonNumber: true, title: true },
      },
    },
  });
}

async function getResearchNoteById(id, userId = null) {
  const note = await prisma.researchNote.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
      controller: true,
      chapter: true,
      lesson: true,
    },
  });

  if (!note) {
    const error = new Error("Research note not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!note.isPublic && note.userId !== userId) {
    const error = new Error("Access denied to private research note.");
    error.statusCode = 403;
    throw error;
  }

  return note;
}

async function createResearchNote(userId, data) {
  const formattedTags = Array.isArray(data.tags)
    ? data.tags.join(", ")
    : (data.tags || null);

  return await prisma.researchNote.create({
    data: {
      userId,
      title: data.title,
      content: data.content,
      category: data.category || "GENERAL",
      tags: formattedTags,
      controllerId: data.controllerId || null,
      chapterId: data.chapterId || null,
      lessonId: data.lessonId || null,
      isPublic: data.isPublic || false,
    },
    include: {
      controller: { select: { id: true, name: true } },
      chapter: { select: { id: true, title: true } },
    },
  });
}

async function updateResearchNote(userId, noteId, data) {
  const note = await prisma.researchNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    const error = new Error("Research note not found or unauthorized.");
    error.statusCode = 404;
    throw error;
  }

  const updateData = { ...data };
  if (Array.isArray(updateData.tags)) {
    updateData.tags = updateData.tags.join(", ");
  }

  return await prisma.researchNote.update({
    where: { id: noteId },
    data: updateData,
  });
}

async function deleteResearchNote(userId, noteId) {
  const note = await prisma.researchNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    const error = new Error("Research note not found or unauthorized.");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.researchNote.delete({
    where: { id: noteId },
  });
}

module.exports = {
  listResearchNotes,
  getResearchNoteById,
  createResearchNote,
  updateResearchNote,
  deleteResearchNote,
};
