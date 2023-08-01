const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const User = require("./User");
const Media = require("./Media");

const Post = sequelize.define("Post", {
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mediaType: {
    type: DataTypes.ENUM("photo", "video", "gallery"),
    allowNull: false,
  },
  mediaUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
});

Post.belongsTo(User);
Post.hasMany(Media, { as: "media", foreignKey: "postId" });

module.exports = Post;
