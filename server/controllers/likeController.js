const Like = require("../models/Like");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Story = require("../models/Story");

const addLike = async (req, res) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;
  try {
    // Проверяем, существует ли пользователь
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Выбираем модель сущности на основе типа
    let entityModel;
    switch (entityType) {
      case "post":
        entityModel = Post;
        break;
      case "comment":
        entityModel = Comment;
        break;
      case "story":
        entityModel = Story;
        break;
      default:
        return res.status(400).json({ error: "Недопустимый тип сущности" });
    }

    // Проверяем, существует ли сущность
    const entity = await entityModel.findByPk(entityId);
    if (!entity) {
      return res.status(404).json({ error: "Сущность не найдена" });
    }

    // Создаем новый лайк
    const newLike = await Like.create({
      userId: user.id,
      [`${entityType}Id`]: entity.id,
    });

    res.status(201).json(newLike);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка при добавлении лайка" });
  }
};

const removeLike = async (req, res) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;
  try {
    // Проверяем, существует ли пользователь
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Выбираем модель сущности на основе типа
    let entityModel;
    switch (entityType) {
      case "post":
        entityModel = Post;
        break;
      case "comment":
        entityModel = Comment;
        break;
      case "story":
        entityModel = Story;
        break;
      default:
        return res.status(400).json({ error: "Недопустимый тип сущности" });
    }

    // Проверяем, существует ли сущность
    const entity = await entityModel.findByPk(entityId);
    if (!entity) {
      return res.status(404).json({ error: "Сущность не найдена" });
    }

    // Удаляем лайк пользователя с этой сущностью
    await Like.destroy({
      where: {
        userId: user.id,
        [`${entityType}Id`]: entity.id,
      },
    });

    res.status(200).json({ message: "Лайк успешно удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка при удалении лайка" });
  }
};

module.exports = { addLike, removeLike };
