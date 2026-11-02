const { z } = require("zod");

const controllerSchema = z.object({
  name: z.string().min(2, "Controller model designation is required"),
  commonName: z.string().min(2, "Friendly name is required"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  family: z.string().min(2),
  architecture: z.string().min(2),
  core: z.string().min(2),
  manufacturer: z.string().min(2),
  bitWidth: z.coerce.number().int(),
  maxClockSpeedMHz: z.coerce.number().positive(),
  flashKb: z.coerce.number().nonnegative(),
  sramKb: z.coerce.number().nonnegative(),
  eepromKb: z.coerce.number().nonnegative().optional().nullable(),
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
  wireless: z.string().optional().nullable(),
  fpu: z.boolean().default(false),
  dsp: z.boolean().default(false),
  dmaChannels: z.coerce.number().int().nonnegative().default(0),
  deepSleepCurrentUa: z.coerce.number().nonnegative().optional().nullable(),
  packageTypes: z.string().min(2),
  description: z.string().min(10),
  architecturalNotes: z.string().min(10),
  applications: z.string().optional().nullable(),
  datasheetUrl: z.string().url("Valid datasheet URL is required"),
  pinoutDiagram: z.string().url().optional().nullable().or(z.literal("")),
  specifications: z.record(z.any()).optional().nullable(),
  pinoutConfig: z.record(z.any()).optional().nullable(),
  isFeatured: z.boolean().default(false),
});

const controllerQuerySchema = z.object({
  search: z.string().optional(),
  family: z.string().optional(),
  architecture: z.string().optional(),
  manufacturer: z.string().optional(),
  application: z.string().optional(),
  bitWidth: z.coerce.number().int().optional(),
  wirelessOnly: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(["clock_desc", "clock_asc", "flash_desc", "name_asc"]).optional(),
});

module.exports = {
  controllerSchema,
  controllerQuerySchema,
};
