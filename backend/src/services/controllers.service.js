const prisma = require("../lib/prisma");

async function listControllers(filters = {}) {
  const { search, family, architecture, manufacturer, bitWidth, wirelessOnly, page = 1, limit = 20 } = filters;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { commonName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { architecture: { contains: search, mode: "insensitive" } },
    ];
  }

  if (family) {
    where.family = { equals: family, mode: "insensitive" };
  }

  if (architecture) {
    where.architecture = { contains: architecture, mode: "insensitive" };
  }

  if (manufacturer) {
    where.manufacturer = { equals: manufacturer, mode: "insensitive" };
  }

  if (bitWidth) {
    where.bitWidth = parseInt(bitWidth, 10);
  }

  if (wirelessOnly === "true") {
    where.wireless = { not: null };
  }

  const skip = (page - 1) * limit;

  const [total, controllers] = await Promise.all([
    prisma.controller.count({ where }),
    prisma.controller.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
  ]);

  return {
    controllers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getFeaturedControllers() {
  return await prisma.controller.findMany({
    where: { isFeatured: true },
    orderBy: { maxClockSpeedMHz: "desc" },
    take: 6,
  });
}

async function getControllerById(id) {
  const controller = await prisma.controller.findFirst({
    where: {
      OR: [{ id }, { name: id }],
    },
    include: {
      researchNotes: {
        where: { isPublic: true },
        select: {
          id: true,
          title: true,
          category: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
      _count: {
        select: { bookmarks: true, researchNotes: true },
      },
    },
  });

  if (!controller) {
    const error = new Error("Microcontroller not found in laboratory registry.");
    error.statusCode = 404;
    throw error;
  }

  return controller;
}

async function compareControllers(ids) {
  if (!ids || ids.length === 0) {
    const error = new Error("At least one controller ID is required for comparison.");
    error.statusCode = 400;
    throw error;
  }

  const controllers = await prisma.controller.findMany({
    where: {
      id: { in: ids },
    },
  });

  return controllers;
}

async function createController(data) {
  return await prisma.controller.create({ data });
}

async function updateController(id, data) {
  return await prisma.controller.update({
    where: { id },
    data,
  });
}

async function deleteController(id) {
  return await prisma.controller.delete({
    where: { id },
  });
}

module.exports = {
  listControllers,
  getFeaturedControllers,
  getControllerById,
  compareControllers,
  createController,
  updateController,
  deleteController,
};

