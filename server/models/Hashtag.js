// models/Hashtag.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Hashtag = sequelize.define("Hashtag", {
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Hashtag;
