const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Post;
