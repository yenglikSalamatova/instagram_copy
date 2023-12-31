const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify", authController.verify);
router.post("/resend-code", authController.resendVerificationCode);
router.post("/login", authController.login);

module.exports = router;
