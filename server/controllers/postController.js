const Post = require("../models/Post");
const Media = require("../models/Media");
const path = require("path");
const fs = require("fs");

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      caption: req.body.caption,
      UserId: req.user.id,
    });

    // Создаем связанные медиа-файлы
    const mediaPromises = req.files.map(async (file) => {
      return Media.create({
        url: `/uploads/${req.user.id}/media/${file.filename}`,
        type: file.mimetype.startsWith("image/") ? "photo" : "video",
        postId: newPost.id,
      });
    });

    await Promise.all(mediaPromises);
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when creating a post" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [{ model: Media, as: "media" }],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when find all posts" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: Media, as: "media" }],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when find all posts" });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        id: req.params.id,
      },
      include: [{ model: Media, as: "media" }],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when find all posts" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
      include: [
        {
          model: Media,
          as: "media",
        },
      ],
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Пост не найден или у вас нет прав на его удаление" });
    }
    // Удалить файлы медиа с диска
    post.media.forEach((media) => {
      const filePath = path.join(__dirname, "../../", "public", media.url);
      fs.unlink(filePath, (err) => {
        if (err) console.error(err);
      });
    });
    // Удалить пост
    await post.destroy();
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when delete post" });
  }
};

const editPost = async (req, res) => {
  const { caption } = req.body;

  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
      include: [
        {
          model: Media,
          as: "media",
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "Пост не найден или у вас нет прав на его редактирование",
      });
    }
    if (req.files) {
      // Удалить файлы медиа с диска
      post.media.forEach((media) => {
        const filePath = path.join(__dirname, "../../", "public", media.url);
        fs.unlink(filePath, (err) => {
          if (err) console.error(err);
        });
      });

      // Создаем новые  медиа-файлы
      const mediaPromises = req.files.map(async (file) => {
        return Media.create({
          url: `/uploads/${req.user.id}/media/${file.filename}`,
          type: file.mimetype.startsWith("image/") ? "photo" : "video",
          postId: post.id,
        });
      });
      await Promise.all(mediaPromises);
    }
    post.caption = caption;
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when editing a post" });
  }
};

module.exports = {
  createPost,
  getMyPosts,
  getAllPosts,
  getPost,
  deletePost,
  editPost,
};
