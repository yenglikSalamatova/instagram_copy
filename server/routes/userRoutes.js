const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");
const { avatarUpload } = require("../middleware/uploadMiddleware");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.patch("/", authenticateToken, avatarUpload, userController.editMe);

module.exports = router;
