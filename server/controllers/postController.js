const Post = require("../models/Post");
const Media = require("../models/Media");
const mime = require("mime-types");
const path = require("path");
const { videoUpload, imageUpload } = require("../middleware/uploadMiddleware");

const createPost = async (req, res) => {
  try {
    const mediaType = req.files[0].mimetype.startsWith("image/")
      ? "photo"
      : "video";
    const newPost = await Post.create({
      caption: req.body.caption,
      mediaType,
      UserId: req.user.id,
    });

    // Создаем связанные медиа-файлы
    const mediaPromises = req.files.map(async (file) => {
      return Media.create({
        url: `/upload/${req.user.id}/media/${file.filename}`,
        type: mediaType,
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

module.exports = { createPost };
