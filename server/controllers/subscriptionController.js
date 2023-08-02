const Subscription = require("../models/Subscription");
const User = require("../models/User");
require("../models/associations");

const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    // Check if the user is trying to follow themselves
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // Check if the user being followed exists
    const userToFollow = await User.findByPk(followingId);
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already following the other user
    const existingFollow = await Subscription.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    // Create a new follow record in the database
    await Subscription.create({ followerId, followingId });

    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { followUser };
