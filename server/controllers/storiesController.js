const Story = require("../models/Story");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

async function createStories(req, res) {
  try {
    const { title } = req.body;
    const content = `/uploads/${req.user.id}/media/${req.file.filename}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    console.log(expiresAt);
    const UserId = req.user.id;
    console.log(UserId);
    const story = await Story.create({
      title,
      content,
      UserId,
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
        UserId: req.user.id,
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

async function getStoryByUserId(req, res) {
  try {
    const currentDate = new Date();
    const stories = await Story.findAll({
      where: {
        UserId: req.params.userId,
        expiresAt: {
          [Op.gt]: currentDate, // Оператор ">" для сравнения с текущей датой
        },
      },
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

module.exports = { createStories, deleteStories, getStoryByUserId };
