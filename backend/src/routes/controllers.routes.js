const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");

const router = express.Router();

const controllerSchema = z.object({
  name: z.string().min(2),
  commonName: z.string().min(2),
  family: z.string().min(1),
  architecture: z.string().min(2),
  core: z.string().min(2),
  manufacturer: z.string().min(2),
  bitWidth: z.coerce.number().int().positive(),
  maxClockSpeedMHz: z.coerce.number().positive(),
  flashKb: z.coerce.number().positive(),
  sramKb: z.coerce.number().positive(),
  eepromKb: z.coerce.number().nullable().optional(),
  operatingVoltageMin: z.coerce.number().positive(),
  operatingVoltageMax: z.coerce.number().positive(),
  logicLevel: z.string().min(1),
  gpioCount: z.coerce.number().int().nonnegative(),
  adcChannels: z.coerce.number().int().nonnegative(),
  adcResolutionBits: z.coerce.number().int().nonnegative(),
  dacChannels: z.coerce.number().int().nonnegative().default(0),
  timers: z.coerce.number().int().nonnegative(),
  uartCount: z.coerce.number().int().nonnegative(),
  spiCount: z.coerce.number().int().nonnegative(),
  i2cCount: z.coerce.number().int().nonnegative(),
  canCount: z.coerce.number().int().nonnegative().default(0),
  usbSupport: z.boolean().default(false),
  wireless: z.string().nullable().optional(),
  fpu: z.boolean().default(false),
  dsp: z.boolean().default(false),
  dmaChannels: z.coerce.number().int().nonnegative().default(0),
  deepSleepCurrentUa: z.coerce.number().nullable().optional(),
  packageTypes: z.string().min(1),
  description: z.string().min(10),
  architecturalNotes: z.string().min(10),
  datasheetUrl: z.string().url(),
  pinoutDiagram: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
});

// GET /api/controllers (Search, filter, list)
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const {
      family,
      architecture,
      bitWidth,
      minClock,
      maxClock,
      wireless,
      fpu,
      search,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const where = {};

    if (family && family !== "ALL") {
      where.family = family;
    }

    if (bitWidth && bitWidth !== "ALL") {
      where.bitWidth = parseInt(bitWidth, 10);
    }

    if (wireless === "true") {
      where.wireless = { not: null };
    }

    if (fpu === "true") {
      where.fpu = true;
    }

    if (minClock || maxClock) {
      where.maxClockSpeedMHz = {};
      if (minClock) where.maxClockSpeedMHz.gte = parseFloat(minClock);
      if (maxClock) where.maxClockSpeedMHz.lte = parseFloat(maxClock);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { commonName: { contains: search, mode: "insensitive" } },
        { family: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
        { architecture: { contains: search, mode: "insensitive" } },
        { core: { contains: search, mode: "insensitive" } },
      ];
    }

    const controllers = await prisma.controller.findMany({
      where,
      orderBy: { [sortBy]: order === "desc" ? "desc" : "asc" },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });

    // Check if user has bookmarked these controllers
    let userBookmarks = new Set();
    if (req.user) {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: req.user.id,
          itemType: "CONTROLLER",
        },
        select: { itemId: true },
      });
      userBookmarks = new Set(bookmarks.map((b) => b.itemId));
    }

    const enriched = controllers.map((c) => ({
      ...c,
      isBookmarked: userBookmarks.has(c.id),
      bookmarkCount: c._count.bookmarks,
    }));

    res.json({
      success: true,
      count: enriched.length,
      controllers: enriched,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/controllers/featured
router.get("/featured", async (req, res, next) => {
  try {
    const featured = await prisma.controller.findMany({
      where: { isFeatured: true },
      take: 6,
    });
    res.json({ success: true, controllers: featured });
  } catch (error) {
    next(error);
  }
});

// GET /api/controllers/compare?ids=id1,id2,id3
router.get("/compare", async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        success: false,
        error: "Comma-separated list of controller IDs required in 'ids' query parameter.",
      });
    }

    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
    if (idList.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one valid controller ID must be provided.",
      });
    }

    const controllers = await prisma.controller.findMany({
      where: { id: { in: idList } },
    });

    // Calculate comparative metrics normalized on a 0 - 100 scale
    const metrics = controllers.map((c) => {
      // Clock speed score (e.g. 16 MHz -> 20, 84 MHz -> 65, 240 MHz -> 90, 480 MHz -> 100)
      const clockScore = Math.min(100, Math.round((c.maxClockSpeedMHz / 480) * 100));
      // Memory score (Flash + SRAM combined)
      const totalMemKb = c.flashKb + c.sramKb;
      const memScore = Math.min(100, Math.round((Math.log10(totalMemKb) / Math.log10(10000)) * 100));
      // IO richness score
      const ioScore = Math.min(100, Math.round(((c.gpioCount + c.uartCount * 5 + c.spiCount * 5 + c.i2cCount * 5) / 120) * 100));
      // Analog capability
      const analogScore = Math.min(100, Math.round(((c.adcChannels * (c.adcResolutionBits / 16) + c.dacChannels * 15) / 45) * 100));
      // Power efficiency score (lower deep sleep current is higher score)
      const sleepUa = c.deepSleepCurrentUa || 20.0;
      const powerScore = Math.max(10, Math.min(100, Math.round(100 - Math.log10(sleepUa + 0.1) * 30)));

      return {
        id: c.id,
        name: c.name,
        radar: {
          performance: clockScore,
          memory: memScore,
          ioCapabilities: ioScore,
          analogPrecision: analogScore,
          powerEfficiency: powerScore,
        },
      };
    });

    res.json({
      success: true,
      controllers,
      metrics,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/controllers/:id
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const controller = await prisma.controller.findUnique({
      where: { id },
      include: {
        _count: { select: { bookmarks: true } },
      },
    });

    if (!controller) {
      return res.status(404).json({
        success: false,
        error: "Microcontroller profile not found in silicon archives.",
      });
    }

    let isBookmarked = false;
    if (req.user) {
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          userId: req.user.id,
          itemType: "CONTROLLER",
          itemId: controller.id,
        },
      });
      isBookmarked = !!bookmark;
    }

    res.json({
      success: true,
      controller: {
        ...controller,
        isBookmarked,
        bookmarkCount: controller._count.bookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/controllers (Admin only)
router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const validated = controllerSchema.parse(req.body);
    const created = await prisma.controller.create({
      data: validated,
    });
    res.status(201).json({
      success: true,
      message: "Silicon entry added to laboratory archive.",
      controller: created,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/controllers/:id (Admin only)
router.put("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = controllerSchema.partial().parse(req.body);
    const updated = await prisma.controller.update({
      where: { id },
      data: validated,
    });
    res.json({
      success: true,
      message: "Microcontroller specification updated successfully.",
      controller: updated,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/controllers/:id (Admin only)
router.delete("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.controller.delete({ where: { id } });
    res.json({
      success: true,
      message: "Microcontroller deleted from archive.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

