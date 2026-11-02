const express = require("express");
const controllersController = require("../controllers/controllers.controller");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { controllerSchema, controllerQuerySchema } = require("../validators/controllers.validator");

const router = express.Router();

router.get("/", validate(controllerQuerySchema, "query"), controllersController.list);
router.get("/featured", controllersController.featured);
router.get("/compare", controllersController.compare);
router.get("/:id", controllersController.getById);

// Admin-only mutations
router.post("/", authenticate, requireAdmin, validate(controllerSchema), controllersController.create);
router.put("/:id", authenticate, requireAdmin, validate(controllerSchema.partial()), controllersController.update);
router.delete("/:id", authenticate, requireAdmin, controllersController.remove);

module.exports = router;
