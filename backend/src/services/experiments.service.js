const prisma = require("../lib/prisma");

async function getUserExperiments(userId) {
  return await prisma.savedExperiment.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

async function getExperimentById(userId, experimentId) {
  const experiment = await prisma.savedExperiment.findFirst({
    where: {
      id: experimentId,
      userId,
    },
  });

  if (!experiment) {
    const error = new Error("Laboratory experiment configuration not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...experiment,
    configState: typeof experiment.configState === "string" ? JSON.parse(experiment.configState) : experiment.configState,
  };
}

async function saveExperiment(userId, data) {
  const serializedConfig = typeof data.configState === "object" ? JSON.stringify(data.configState) : data.configState;

  const experiment = await prisma.savedExperiment.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      experimentType: data.experimentType,
      configState: serializedConfig,
      schematicData: data.schematicData || null,
    },
  });

  // Award Silicon Ignition badge if first experiment
  const count = await prisma.savedExperiment.count({ where: { userId } });
  if (count === 1) {
    const badge = await prisma.badge.findUnique({ where: { code: "FIRST_EXPERIMENT" } });
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        update: {},
        create: { userId, badgeId: badge.id },
      });
    }
  }

  return experiment;
}

async function updateExperiment(userId, experimentId, data) {
  const existing = await prisma.savedExperiment.findFirst({
    where: { id: experimentId, userId },
  });

  if (!existing) {
    const error = new Error("Laboratory experiment configuration not found.");
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.experimentType) updateData.experimentType = data.experimentType;
  if (data.configState) {
    updateData.configState = typeof data.configState === "object" ? JSON.stringify(data.configState) : data.configState;
  }
  if (data.schematicData !== undefined) updateData.schematicData = data.schematicData;

  return await prisma.savedExperiment.update({
    where: { id: experimentId },
    data: updateData,
  });
}

async function deleteExperiment(userId, experimentId) {
  const existing = await prisma.savedExperiment.findFirst({
    where: { id: experimentId, userId },
  });

  if (!existing) {
    const error = new Error("Laboratory experiment configuration not found.");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.savedExperiment.delete({
    where: { id: experimentId },
  });
}

module.exports = {
  getUserExperiments,
  getExperimentById,
  saveExperiment,
  updateExperiment,
  deleteExperiment,
};

