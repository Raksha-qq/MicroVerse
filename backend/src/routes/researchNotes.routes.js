const express = require("express");
const researchNotesController = require("../controllers/researchNotes.controller");
const validate = require("../middleware/validate");
const { authenticate, optionalAuth } = require("../middleware/auth");
const { researchNoteSchema } = require("../validators/researchNotes.validator");

const router = express.Router();

router.get("/", optionalAuth, researchNotesController.list);
router.get("/:id", optionalAuth, researchNotesController.getById);
router.post("/", authenticate, validate(researchNoteSchema), researchNotesController.create);
router.put("/:id", authenticate, validate(researchNoteSchema.partial()), researchNotesController.update);
router.delete("/:id", authenticate, researchNotesController.remove);

module.exports = router;

