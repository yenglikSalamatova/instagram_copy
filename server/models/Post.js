const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Media = require("./Media");

const Post = sequelize.define("Post", {
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Post.belongsTo(User);
Post.hasMany(Media, { as: "media", foreignKey: "postId" });

module.exports = Post;
