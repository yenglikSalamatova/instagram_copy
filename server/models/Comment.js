// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Comment;
