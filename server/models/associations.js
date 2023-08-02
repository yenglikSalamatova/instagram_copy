// associations.js

const User = require("./User");
const Story = require("./Story");
const Comment = require("./Comment");
const Post = require("./Comment");
const sequelize = require("../config/database");

module.exports = (sequelize) => {
  User.hasMany(Story, {
    foreignKey: "UserId",
    as: "stories",
  });

  Story.belongsTo(User, {
    foreignKey: "UserId",
    as: "user",
  });

  // Комментарии
  Comment.belongsTo(User, {
    foreignKey: "UserId",
  });
  Comment.belongsTo(Post, {
    foreignKey: "PostId",
  });
  User.hasMany(Comment, {
    foreignKey: "UserId",
  });
  Post.hasMany(Comment, {
    foreignKey: "PostId",
  });

  //Подписчики
};
