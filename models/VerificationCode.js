// models/verificationCode.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VerificationCode = sequelize.define("VerificationCode", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

VerificationCode.belongsTo(VerificationCode, {
  foreignKey: "userId",
});

module.exports = VerificationCode;
