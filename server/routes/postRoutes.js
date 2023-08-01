const express = require("express");
const passport = require("passport");
const authenticateToken = passport.authenticate("jwt", { session: false });
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/", authenticateToken, postController.createPost);

module.exports = router;
