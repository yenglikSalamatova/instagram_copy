// associations.js
const User = require("./User");
const Post = require("./Post");
const Media = require("./Media");
const Story = require("./Story");
const Comment = require("./Comment");
const Subscription = require("./Subscription");

// Посты и юзер - юзер один - постов много
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Посты и медиа - пост один - медиа много
Post.hasMany(Media, { as: "media", foreignKey: "postId" });
Media.belongsTo(Post, { foreignKey: "postId" });

// Истории - юзер один - истории много
User.hasMany(Story, {
  foreignKey: "userId",
  as: "stories",
});
Story.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Комментарии и юзер - комментариев много - юзер один
Comment.belongsTo(User, {
  foreignKey: "userId",
});
User.hasMany(Comment, {
  foreignKey: "userId",
});

// Комменатрии и пост - комментариев много - пост один
Comment.belongsTo(Post, {
  foreignKey: "postId",
});
Post.hasMany(Comment, {
  foreignKey: "postId",
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
