// associations.js
const User = require("./User");
const Post = require("./Post");
const Media = require("./Media");
const Story = require("./Story");
const Comment = require("./Comment");
const Subscription = require("./Subscription");

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});
User.hasMany(Story, {
  foreignKey: "userId",
  as: "stories",
});
User.hasMany(Comment, {
  foreignKey: "userId",
});
Subscription.belongsTo(User, { foreignKey: "followerId", as: "follower" });
Subscription.belongsTo(User, { foreignKey: "followingId", as: "following" });
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Post.hasMany(Media, { as: "media", foreignKey: "postId" });
Media.belongsTo(Post, { foreignKey: "postId" });

Story.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
});
Post.hasMany(Comment, {
  foreignKey: "postId",
});
