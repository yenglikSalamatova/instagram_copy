// models/Media.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Media = sequelize.define("Media", {
  type: {
    type: DataTypes.ENUM("photo", "video"),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Media;
