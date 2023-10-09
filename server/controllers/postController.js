const Post = require("../models/Post");
const Media = require("../models/Media");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Subscription = require("../models/Subscription");
require("../models/associations");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const createPost = async (req, res) => {
  try {
    console.log(req.user.id);
    const newPost = await Post.create({
      caption: req.body.caption,
      userId: req.user.id,
    });

    if (req.files.length === 0) {
      res.status(500).json({ error: "No files to upload" });
    }

    // Создаем связанные медиа-файлы
    const mediaPromises = req.files.map(async (file) => {
      return Media.create({
        url: `/uploads/${req.user.id}/media/${file.filename}`,
        type: file.mimetype.startsWith("image/") ? "photo" : "video",
        postId: newPost.id,
      });
    });

    const media = await Promise.all(mediaPromises);
    newPost.media = media;

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
        userId: req.user.id,
      },
      include: [
        { model: Media, as: "media" },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "phone",
              "birthday_date",
              "email",
              "createdAt",
              "updatedAt",
              "isVerified",
            ],
          },
        },
      ],
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
      include: [
        { model: Media, as: "media" },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "phone",
              "birthday_date",
              "email",
              "createdAt",
              "updatedAt",
              "isVerified",
            ],
          },
        },
      ],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when find all posts" });
  }
};

const getAllFollowedPosts = async (req, res) => {
  try {
    const followings = await Subscription.findAll({
      where: {
        followerId: req.user.id,
      },
    });

    const followingIds = followings.map((following) => following.followingId);

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { userId: { [Op.in]: followingIds } },
        ],
      },
      include: [
        { model: Media, as: "media" },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "phone",
              "birthday_date",
              "email",
              "createdAt",
              "updatedAt",
              "isVerified",
            ],
          },
        },
      ],
    });

    posts.sort((a, b) => b.createdAt - a.createdAt);

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
      include: [
        { model: Media, as: "media" },
        { model: User, as: "user" },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: [
                  "password",
                  "phone",
                  "birthday_date",
                  "email",
                  "createdAt",
                  "updatedAt",
                  "isVerified",
                ],
              },
            },
          ],
        },
        { model: Like, as: "likes" },
      ],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when find post by id" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: Media,
          as: "media",
        },
        {
          model: Like,
          as: "likes",
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: Like,
              as: "likes",
            },
          ],
        },
      ],
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Пост не найден или у вас нет прав на его удаление" });
    }

    // Удалить лайки у комментариев
    post.comments.forEach(async (comment) => {
      await Like.destroy({
        where: {
          commentId: comment.id,
        },
      });
    });

    // Удалить лайки
    await Like.destroy({
      where: {
        postId: post.id,
      },
    });

    await Comment.destroy({
      where: {
        postId: post.id,
      },
    });

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
        userId: req.user.id,
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
    if (req.files && req.files.length > 0) {
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

const getPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.findAll({
      where: { userId: user.id },
      include: [
        { model: Media, as: "media" },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "phone",
              "birthday_date",
              "email",
              "createdAt",
              "updatedAt",
              "isVerified",
            ],
          },
        },
      ],
    });

    for (let post of posts) {
      post.setDataValue("commentCount", await post.countComments());
      post.setDataValue("likeCount", await post.countLikes());
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when get posts by username" });
  }
};

module.exports = {
  createPost,
  getMyPosts,
  getAllPosts,
  getPost,
  deletePost,
  editPost,
  getPostsByUsername,
  getAllFollowedPosts,
};
