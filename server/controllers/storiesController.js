const Story = require("../models/Story");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
require("../models/associations");

async function createStories(req, res) {
  try {
    const { title } = req.body;
    const content = `/uploads/${req.user.id}/media/${req.file.filename}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    console.log(expiresAt);
    const userId = req.user.id;
    console.log(userId);
    const story = await Story.create({
      title,
      content,
      userId,
      expiresAt,
    });

    res.status(201).json({ story });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteStories(req, res) {
  try {
    const story = await Story.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    if (!story) {
      return res.status(404).json({
        message: "История не найдена или у вас нет прав на его удаление",
      });
    }
    const filePath = path.join(__dirname, "../../", "public", story.content);
    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });
    await story.destroy();
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function getStoryByuserId(req, res) {
  try {
    const currentDate = new Date();
    const stories = await Story.findAll({
      where: {
        userId: req.params.userId,
        expiresAt: {
          [Op.gt]: currentDate, // Оператор ">" для сравнения с текущей датой
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilePicture"],
        },
      ],
    });
    if (!stories) {
      return res.status(404).json({
        message: "Истории не найдены",
      });
    }
    res.status(200).json({ stories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const getAllFollowedStories = async (req, res) => {
  try {
    const followings = await Subscription.findAll({
      where: {
        followerId: req.user.id,
      },
    });

    const followingIds = followings.map((following) => following.followedId);

    const currentDate = new Date();
    const stories = await Story.findAll({
      where: {
        expiresAt: {
          [Op.gt]: currentDate, // Оператор ">" для сравнения с текущей датой
        },
        userId: { [Op.in]: followingIds },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profilePicture"],
        },
      ],
    });

    if (stories.length === 0) {
      return res.status(404).json({
        message: "Истории не найдены",
      });
    }

    // Создаём объект для хранения уникальных данных пользователей
    const uniqueUsers = {};

    // Фильтруем и обрабатываем сторисы
    stories.forEach((story) => {
      const { userId, user } = story;
      if (!uniqueUsers[userId]) {
        // Если пользователя нет в уникальных данных, добавляем его
        uniqueUsers[userId] = {
          userId,
          user: user.toJSON(), // Конвертируем объект пользователя в JSON
        };
      }
    });

    // Преобразуем объект обратно в массив уникальных пользователей
    const uniqueUsersArray = Object.values(uniqueUsers);

    uniqueUsersArray.sort((a, b) => {
      if (a.userId === req.user.id) return -1;
      if (b.userId === req.user.id) return 1;
      return b.user.createdAt - a.user.createdAt;
    });

    res.status(200).send(uniqueUsersArray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStories,
  deleteStories,
  getStoryByuserId,
  getAllFollowedStories,
};
