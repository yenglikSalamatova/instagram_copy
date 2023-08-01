const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Subscription = sequelize.define("Subscription", {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Subscription;
