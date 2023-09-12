// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Post = require("./Post");

const Comment = sequelize.define("Comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// Increment the commentsCount of the post
Comment.afterCreate(async (comment) => {
  await Post.increment("commentsCount", {
    by: 1,
    where: { id: comment.postId },
  });
  console.log("Comment created");
});

// Decrement the commentsCount of the post
Comment.beforeDestroy(async (comment) => {
  await Post.decrement("commentsCount", {
    by: 1,
    where: { id: comment.postId },
  });
  console.log("Comment destroyed");
});

module.exports = Comment;
