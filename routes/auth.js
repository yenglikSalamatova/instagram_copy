const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/verify", authController.verify);
router.post("/resend-code", authController.resendVerificationCode);
router.post("/resend-code", authController.resendVerificationCode);

module.exports = router;
