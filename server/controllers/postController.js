const Post = require("../models/Post");
const Media = require("../models/Media");

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
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Пост не найден или у вас нет прав на его удаление" });
    }
    // Удалить пост
    await post.destroy();
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when delete post" });
  }
};

module.exports = { createPost, getMyPosts, getAllPosts, getPost, deletePost };
