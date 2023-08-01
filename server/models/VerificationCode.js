const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VerificationCode = sequelize.define("VerificationCode", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = VerificationCode;
