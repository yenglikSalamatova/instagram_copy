// models/Hashtag.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Hashtag = sequelize.define("Hashtag", {
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Hashtag;
