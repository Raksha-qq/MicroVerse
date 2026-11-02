const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const experimentSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  experimentType: z.enum(["GPIO", "PWM", "PROTOCOL", "PID", "BREADBOARD"]),
  configState: z.record(z.any()).or(z.string()),
});

// GET /api/experiments (User's saved experiments)
router.get("/", authenticate, async (req, res, next) => {
  try {
    const experiments = await prisma.savedExperiment.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: "desc" },
    });

    const parsed = experiments.map((exp) => ({
      ...exp,
      configState:
        typeof exp.configState === "string" ? JSON.parse(exp.configState) : exp.configState,
    }));

    res.json({ success: true, experiments: parsed });
  } catch (error) {
    next(error);
  }
});

// GET /api/experiments/:id
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const experiment = await prisma.savedExperiment.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!experiment) {
      return res.status(404).json({ success: false, error: "Saved experiment not found." });
    }

    res.json({
      success: true,
      experiment: {
        ...experiment,
        configState:
          typeof experiment.configState === "string"
            ? JSON.parse(experiment.configState)
            : experiment.configState,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/experiments (Save experiment configuration)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const validated = experimentSchema.parse(req.body);

    const saved = await prisma.savedExperiment.create({
      data: {
        userId: req.user.id,
        title: validated.title,
        description: validated.description || null,
        experimentType: validated.experimentType,
        configState:
          typeof validated.configState === "string"
            ? validated.configState
            : JSON.stringify(validated.configState),
      },
    });

    // Award badge if first experiment saved
    const userExpCount = await prisma.savedExperiment.count({
      where: { userId: req.user.id },
    });

    let newBadgeUnlocked = null;
    if (userExpCount === 1) {
      const ignitionBadge = await prisma.badge.findUnique({
        where: { code: "FIRST_EXPERIMENT" },
      });
      if (ignitionBadge) {
        const hasBadge = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId: req.user.id, badgeId: ignitionBadge.id } },
        });
        if (!hasBadge) {
          newBadgeUnlocked = ignitionBadge;
          await prisma.userBadge.create({
            data: { userId: req.user.id, badgeId: ignitionBadge.id },
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Laboratory experiment state saved to user profile.",
      experiment: {
        ...saved,
        configState:
          typeof saved.configState === "string" ? JSON.parse(saved.configState) : saved.configState,
      },
      newBadgeUnlocked,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/experiments/:id
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = experimentSchema.partial().parse(req.body);

    const existing = await prisma.savedExperiment.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Experiment not found or unauthorized." });
    }

    const dataToUpdate = { ...validated };
    if (dataToUpdate.configState && typeof dataToUpdate.configState !== "string") {
      dataToUpdate.configState = JSON.stringify(dataToUpdate.configState);
    }

    const updated = await prisma.savedExperiment.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      success: true,
      message: "Experiment configuration updated.",
      experiment: {
        ...updated,
        configState:
          typeof updated.configState === "string"
            ? JSON.parse(updated.configState)
            : updated.configState,
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/experiments/:id
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.savedExperiment.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Experiment not found or unauthorized." });
    }

    await prisma.savedExperiment.delete({ where: { id } });
    res.json({ success: true, message: "Experiment preset deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

