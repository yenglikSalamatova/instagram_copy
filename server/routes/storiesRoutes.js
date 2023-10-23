const express = require("express");
const router = express.Router();
const passport = require("passport");

const storiesController = require("../controllers/storiesController");
const { tempUpload } = require("../middleware/uploadMiddleware");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.post(
  "/",
  authenticateToken,
  tempUpload,
  storiesController.createStories
);

router.delete(
  "/:id",
  authenticateToken,
  tempUpload,
  storiesController.deleteStories
);

router.get("/:userId", authenticateToken, storiesController.getStoryByuserId);

router.get("/", authenticateToken, storiesController.getAllFollowedStories);

module.exports = router;
