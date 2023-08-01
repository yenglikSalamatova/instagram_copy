// models/Like.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Like = sequelize.define("Like", {
  // поля для дополнительной информации о лайке, например, ID пользователя, который поставил лайк
});

module.exports = Like;
