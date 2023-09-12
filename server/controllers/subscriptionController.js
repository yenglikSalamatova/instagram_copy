const Subscription = require("../models/Subscription");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/User");
require("../models/associations");

const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    // Check if the user is trying to follow themselves
    if (followerId == followingId) {
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

const getFollowersByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Находим пользователя по имени
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Получаем подписчиков пользователя
    const followers = await Subscription.findAll({
      where: { followingId: user.id },
      include: [
        {
          model: User,
          as: "follower",
          attributes: {
            exclude: [
              "password",
              "isVerified",
              "phone",
              "email",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    res.status(200).json({ followers });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Произошла ошибка при получении подписчиков" });
  }
};

const getFollowingByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Находим пользователя по имени
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Получаем пользователей, на которых подписан данный пользователь
    const following = await Subscription.findAll({
      where: { followerId: user.id },
      include: [
        {
          model: User,
          as: "following",
          attributes: {
            exclude: [
              "password",
              "isVerified",
              "phone",
              "email",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    res.status(200).json({ following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка при получении подписок" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userSubscriptions = await Subscription.findAll({
      where: { followerId: req.user.id },
    });

    // Если пользователь ни на кого не подписан, то возвращаем 5 самых популярных пользователей
    if (userSubscriptions.length < 5) {
      const popularUsers = await User.findAll({
        order: [["followersCount", "DESC"]],
        limit: 5,
      });
      return res.status(200).json({ users: popularUsers });
    }

    const followingIds = userSubscriptions.map((sub) => sub.followingId);
    // console.log(followingIds);

    // Получаем 5 последних пользователей, на которых не подписан данный пользователь
    let suggestedUsers = await User.findAll({
      where: {
        id: { [Op.notIn]: followingIds, [Op.not]: req.user.id },
      },
      attributes: {
        exclude: [
          "password",
          "isVerified",
          "phone",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
    res.status(200).json({ suggestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка при получении подписок" });
  }
};

const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId == followingId) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    // Check if the user being followed exists
    const userToUnFollow = await User.findByPk(followingId);
    if (!userToUnFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already following the other user
    const existingFollow = await Subscription.findOne({
      where: { followerId, followingId },
    });
    if (!existingFollow) {
      return res.status(400).json({ error: "You are not follow this user" });
    }

    // Remove follow
    await Subscription.destroy({
      where: { followerId, followingId },
      individualHooks: true,
    });

    res.status(201).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  followUser,
  getFollowersByUsername,
  getFollowingByUsername,
  getSuggestedUsers,
  unfollow,
};
