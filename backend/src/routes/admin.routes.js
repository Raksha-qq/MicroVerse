const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { z } = require("zod");
const validate = require("../middleware/validate");

const router = express.Router();

const updateRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

router.get("/metrics", authenticate, requireAdmin, adminController.getMetrics);
router.get("/users", authenticate, requireAdmin, adminController.listUsers);
router.put("/users/:id/role", authenticate, requireAdmin, validate(updateRoleSchema), adminController.updateUserRole);

module.exports = router;
