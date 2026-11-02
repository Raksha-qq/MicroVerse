const prisma = require("../lib/prisma");

async function listControllers(filters = {}) {
  const {
    search,
    family,
    architecture,
    manufacturer,
    application,
    bitWidth,
    wirelessOnly,
    page = 1,
    limit = 20,
    sort,
  } = filters;

  const where = {};

  // Keyword search across multiple fields
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { commonName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { architecture: { contains: search, mode: "insensitive" } },
      { core: { contains: search, mode: "insensitive" } },
      { applications: { contains: search, mode: "insensitive" } },
    ];
  }

  // Exact / partial filters
  if (family) {
    where.family = { equals: family, mode: "insensitive" };
  }

  if (architecture) {
    where.architecture = { contains: architecture, mode: "insensitive" };
  }

  if (manufacturer) {
    where.manufacturer = { contains: manufacturer, mode: "insensitive" };
  }

  if (application) {
    where.applications = { contains: application, mode: "insensitive" };
  }

  if (bitWidth) {
    where.bitWidth = parseInt(bitWidth, 10);
  }

  if (wirelessOnly === "true") {
    where.wireless = { not: null };
  }

  // Sorting
  let orderBy = [{ isFeatured: "desc" }, { name: "asc" }];
  if (sort === "clock_desc") orderBy = [{ maxClockSpeedMHz: "desc" }];
  if (sort === "clock_asc") orderBy = [{ maxClockSpeedMHz: "asc" }];
  if (sort === "flash_desc") orderBy = [{ flashKb: "desc" }];
  if (sort === "name_asc") orderBy = [{ name: "asc" }];

  const skip = (page - 1) * limit;

  const [total, controllers] = await Promise.all([
    prisma.controller.count({ where }),
    prisma.controller.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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

async function getControllerByIdOrSlug(identifier) {
  const controller = await prisma.controller.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
        { name: { equals: identifier, mode: "insensitive" } },
      ],
    },
    include: {
      researchNotes: {
        where: { isPublic: true },
        select: {
          id: true,
          title: true,
          category: true,
          createdAt: true,
          user: { select: { id: true, name: true, username: true } },
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

async function getRelatedControllers(identifier) {
  const current = await prisma.controller.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
        { name: { equals: identifier, mode: "insensitive" } },
      ],
    },
  });

  if (!current) {
    const error = new Error("Source microcontroller not found.");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.controller.findMany({
    where: {
      NOT: { id: current.id },
      OR: [
        { family: current.family },
        { architecture: current.architecture },
        { bitWidth: current.bitWidth },
      ],
    },
    take: 4,
    orderBy: { isFeatured: "desc" },
  });
}

async function compareControllers(ids) {
  if (!ids || ids.length === 0) {
    const error = new Error("At least one controller ID is required for comparison.");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.controller.findMany({
    where: {
      OR: [
        { id: { in: ids } },
        { slug: { in: ids } },
        { name: { in: ids } },
      ],
    },
  });
}

async function createController(data) {
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }
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
  getControllerByIdOrSlug,
  getRelatedControllers,
  compareControllers,
  createController,
  updateController,
  deleteController,
};
