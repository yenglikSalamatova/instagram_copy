const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");
const { tempUpload } = require("../middleware/uploadMiddleware");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.get("/search", authenticateToken, userController.searchUsers);
router.patch("/", authenticateToken, tempUpload, userController.editMe);
router.get("/:username", userController.getUserByUsername);

module.exports = router;
