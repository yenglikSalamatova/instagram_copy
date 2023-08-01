// models/Story.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const User = require("../models/User");

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

Story.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = Story;
