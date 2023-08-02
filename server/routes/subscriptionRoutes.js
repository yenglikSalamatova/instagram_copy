const express = require("express");
const router = express.Router();
const passport = require("passport");
const Subscription = require("../models/Subscription");
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = passport.authenticate("jwt", { session: false });

router.post("/:userId", authenticateToken, subscriptionController.followUser);

module.exports = router;
