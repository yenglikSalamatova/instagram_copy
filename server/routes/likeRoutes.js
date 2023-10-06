const express = require("express");
const router = express.Router();
const passport = require("passport");

const likeController = require("../controllers/likeController");

const authenticateToken = passport.authenticate("jwt", { session: false });

router.post("/", authenticateToken, likeController.addLike);
router.delete("/", authenticateToken, likeController.removeLike);
router.get("/", authenticateToken, likeController.getLikes);

module.exports = router;
