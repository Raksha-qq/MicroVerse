const express = require("express");
const experimentsController = require("../controllers/experiments.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { experimentSchema } = require("../validators/experiments.validator");

const router = express.Router();

router.get("/", authenticate, experimentsController.list);
router.get("/:id", authenticate, experimentsController.getById);
router.post("/", authenticate, validate(experimentSchema), experimentsController.save);
router.put("/:id", authenticate, validate(experimentSchema.partial()), experimentsController.update);
router.delete("/:id", authenticate, experimentsController.remove);

module.exports = router;
