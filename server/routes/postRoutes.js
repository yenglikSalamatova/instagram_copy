const express = require("express");
const passport = require("passport");
const authenticateToken = passport.authenticate("jwt", { session: false });
const router = express.Router();
const postController = require("../controllers/postController");
const { mediaUpload } = require("../middleware/uploadMiddleware");

router.post("/", authenticateToken, mediaUpload, postController.createPost);
router.get("/", authenticateToken, postController.getAllPosts);
router.get("/my", authenticateToken, postController.getMyPosts);
router.get("/:id", authenticateToken, postController.getPost);
router.delete("/:id", authenticateToken, postController.deletePost);

module.exports = router;