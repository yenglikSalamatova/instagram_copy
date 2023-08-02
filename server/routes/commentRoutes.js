const express = require("express");
const router = express.Router();
const passport = require("passport");

const commentController = require("../controllers/commentController");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.post("/", authenticateToken, commentController.addCommentToPost);
router.delete(
  "/:commentId",
  authenticateToken,
  commentController.deleteComment
);
router.get(
  "/:postId",
  authenticateToken,
  commentController.getAllCommentByPostId
);

module.exports = router;
