const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Valid engineering email address is required"),
  password: z.string().min(8, "Security passphrase must be at least 8 characters"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Valid engineering email required"),
  password: z.string().min(1, "Password is required"),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
};

