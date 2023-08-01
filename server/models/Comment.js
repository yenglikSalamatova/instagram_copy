// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Comment = sequelize.define("Comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Comment;
