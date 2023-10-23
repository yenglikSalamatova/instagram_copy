// associations.js
const User = require("./User");
const Post = require("./Post");
const Media = require("./Media");
const Story = require("./Story");
const Comment = require("./Comment");
const Subscription = require("./Subscription");
const Like = require("./Like");
const SavedPost = require("./SavedPost");

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

User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

Subscription.belongsTo(User, { foreignKey: "followerId", as: "follower" });
Subscription.belongsTo(User, { foreignKey: "followingId", as: "following" });
User.hasMany(Subscription, { foreignKey: "followerId", as: "followers" });
User.hasMany(Subscription, { foreignKey: "followingId", as: "following" });
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
  as: "user",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});
Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
});

Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(Post, { foreignKey: "postId" });

Comment.hasMany(Like, { foreignKey: "commentId", as: "likes" });
Like.belongsTo(Comment, { foreignKey: "commentId" });

Story.hasMany(Like, { foreignKey: "storyId", as: "likes" });
Like.belongsTo(Story, { foreignKey: "storyId" });

SavedPost.belongsTo(User, { foreignKey: "userId", as: "user" });
SavedPost.belongsTo(Post, { foreignKey: "postId", as: "post" });
