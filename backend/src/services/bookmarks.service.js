const prisma = require("../lib/prisma");

async function getUserBookmarks(userId) {
  return await prisma.bookmark.findMany({
    where: { userId },
    include: {
      controller: {
        select: {
          id: true,
          name: true,
          commonName: true,
          family: true,
          architecture: true,
          bitWidth: true,
          maxClockSpeedMHz: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function toggleBookmark(userId, itemType, itemId) {
  let resolvedItemId = itemId;

  // If itemType is CONTROLLER, resolve slug or ensure valid controller ID
  if (itemType === "CONTROLLER") {
    const ctrl = await prisma.controller.findFirst({
      where: {
        OR: [{ id: itemId }, { slug: itemId }],
      },
      select: { id: true },
    });
    if (!ctrl) {
      const error = new Error("Target controller for bookmark not found.");
      error.statusCode = 404;
      throw error;
    }
    resolvedItemId = ctrl.id;
  }

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_itemType_itemId: {
        userId,
        itemType,
        itemId: resolvedItemId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false, message: "Bookmark removed" };
  } else {
    const created = await prisma.bookmark.create({
      data: {
        userId,
        itemType,
        itemId: resolvedItemId,
      },
    });
    return { bookmarked: true, bookmark: created, message: "Bookmark saved" };
  }
}

async function removeBookmark(userId, bookmarkId) {
  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId },
  });

  if (!bookmark) {
    const error = new Error("Bookmark not found.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.bookmark.delete({ where: { id: bookmarkId } });
  return { success: true };
}

module.exports = {
  getUserBookmarks,
  toggleBookmark,
  removeBookmark,
};

