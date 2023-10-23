const express = require("express");
const passport = require("passport");
const authenticateToken = passport.authenticate("jwt", { session: false });
const router = express.Router();
const postController = require("../controllers/postController");
const { tempUpload } = require("../middleware/uploadMiddleware");

router.post("/", authenticateToken, tempUpload, postController.createPost);
router.get(
  "/interesting",
  authenticateToken,
  postController.getInterestingPosts
);
router.get("/all", authenticateToken, postController.getAllPosts);
router.get("/my", authenticateToken, postController.getMyPosts);
router.get(
  "/byUsername/:username",

  postController.getPostsByUsername
);
router.get("/saved", authenticateToken, postController.getAllSavedPosts);
router.get("/:id", authenticateToken, postController.getPost);
router.delete("/:id", authenticateToken, postController.deletePost);
router.patch("/:id", authenticateToken, postController.editPost);

router.get("/", authenticateToken, postController.getAllFollowedPosts);

router.post("/saved/:postId", authenticateToken, postController.savePost);
router.delete(
  "/saved/:postId",
  authenticateToken,
  postController.deleteSavedPost
);
module.exports = router;
