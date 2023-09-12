const express = require("express");
const router = express.Router();
const passport = require("passport");

const storiesController = require("../controllers/storiesController");
const { storyUpload } = require("../middleware/uploadMiddleware");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.post(
  "/",
  authenticateToken,
  storyUpload,
  storiesController.createStories
);

router.delete(
  "/:id",
  authenticateToken,
  storyUpload,
  storiesController.deleteStories
);

router.get("/:userId", authenticateToken, storiesController.getStoryByuserId);

router.get("/", authenticateToken, storiesController.getAllFollowedStories);

module.exports = router;
