// associations.js

const User = require("./User");
const Story = require("./Story");
const Comment = require("./Comment");
const Post = require("./Comment");
const Subscription = require("./Subscription");
const sequelize = require("../config/database");

module.exports = (sequelize) => {
  // Посты и юзер - юзер один - постов много
  Post.belongsTo(User);
  User.hasMany(Post);

  // Посты и медиа - пост один - медиа много
  Post.hasMany(Media, { as: "media", foreignKey: "postId" });
  Media.belongsTo(Post, { foreignKey: "postId" });

  // Истории - юзер один - истории много
  User.hasMany(Story, {
    foreignKey: "UserId",
    as: "stories",
  });
  Story.belongsTo(User, {
    foreignKey: "UserId",
    as: "user",
  });

  // Комментарии и юзер - комментариев много - юзер один
  Comment.belongsTo(User, {
    foreignKey: "UserId",
  });
  User.hasMany(Comment, {
    foreignKey: "UserId",
  });

  // Комменатрии и пост - комментариев много - пост один
  Comment.belongsTo(Post, {
    foreignKey: "PostId",
  });
  Post.hasMany(Comment, {
    foreignKey: "PostId",
  });

  //Подписчики и юзер - подписчиков много - юзеров много
  User.belongsToMany(User, {
    through: Subscription,
    as: "following",
    foreignKey: "followerId",
  });

  User.belongsToMany(User, {
    through: Subscription,
    as: "followers",
    foreignKey: "followingId",
  });
};
