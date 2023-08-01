// models/Story.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Story = sequelize.define("Story", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Story;
