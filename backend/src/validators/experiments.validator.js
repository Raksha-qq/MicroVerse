const { z } = require("zod");

const experimentSchema = z.object({
  title: z.string().min(3, "Experiment designation required"),
  description: z.string().optional().nullable(),
  experimentType: z.enum([
    "SIGNAL",
    "PWM",
    "SENSOR",
    "ROBOT",
    "CONTROLLER_SELECTION",
    "GPIO",
    "PROTOCOL",
    "PID",
    "BREADBOARD"
  ]),
  configState: z.any(), // JSON simulation state
  schematicData: z.any().optional().nullable(),
});

module.exports = {
  experimentSchema,
};

