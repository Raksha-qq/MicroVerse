const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Valid engineering email address is required").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Security passphrase must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters"),
  name: z.string().min(2, "Full name must be at least 2 characters").trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores")
    .optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Valid engineering email required").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores")
    .optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
};
