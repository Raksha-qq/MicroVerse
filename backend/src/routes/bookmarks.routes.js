const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const toggleSchema = z.object({
  itemType: z.enum(["CONTROLLER", "CHAPTER", "ROBOTICS"]),
  itemId: z.string(),
});

// GET /api/bookmarks
router.get("/", authenticate, async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        controller: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, bookmarks });
  } catch (error) {
    next(error);
  }
});

// POST /api/bookmarks/toggle
router.post("/toggle", authenticate, async (req, res, next) => {
  try {
    const { itemType, itemId } = toggleSchema.parse(req.body);

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: req.user.id,
          itemType,
          itemId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return res.json({
        success: true,
        isBookmarked: false,
        message: "Bookmark removed.",
      });
    }

    const created = await prisma.bookmark.create({
      data: {
        userId: req.user.id,
        itemType,
        itemId,
      },
    });

    res.json({
      success: true,
      isBookmarked: true,
      message: "Item saved to laboratory bookmarks.",
      bookmark: created,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

