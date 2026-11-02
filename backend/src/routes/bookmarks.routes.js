const express = require("express");
const bookmarksController = require("../controllers/bookmarks.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { toggleBookmarkSchema } = require("../validators/bookmarks.validator");

const router = express.Router();

router.get("/", authenticate, bookmarksController.list);
router.post("/toggle", authenticate, validate(toggleBookmarkSchema), bookmarksController.toggle);
router.delete("/:id", authenticate, bookmarksController.remove);

module.exports = router;
