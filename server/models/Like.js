// models/Like.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Post = require("./Post");
const Comment = require("./Comment");

const Like = sequelize.define("Like", {
  // поля для дополнительной информации о лайке, например, ID пользователя, который поставил лайк
});

// Increment the likesCount of the post
Like.afterCreate(async (like) => {
  if (like.postId) {
    await Post.increment("likesCount", {
      by: 1,
      where: { id: like.postId },
    });
  }
  if (like.commentId) {
    // increment the likesCount of the comment
    await Comment.increment("likesCount", {
      by: 1,
      where: { id: like.commentId },
    });
  }
  console.log("Like created:", like.toJSON());
});

// Decrement the likesCount of the post
Like.afterDestroy(async (like) => {
  if (like.postId) {
    await Post.decrement("likesCount", {
      by: 1,
      where: { id: like.postId },
    });
  }
  if (like.commentId) {
    // decrement the likesCount of the comment
    await Comment.decrement("likesCount", {
      by: 1,
      where: { id: like.commentId },
    });
  }
  console.log("Like destroyed:", like.toJSON());
});

module.exports = Like;
