// associations.js

const User = require("./User");
const Story = require("./Story");
const Comment = require("./Comment");
const Post = require("./Comment");

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
  Comment.belongsTo(User);
  Comment.belongsTo(Post);
  User.hasMany(Comment);
  Post.hasMany(Comment);
};
