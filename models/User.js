// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Поле может быть пустым
    unique: true,
    validate: {
      isEmail: true, // Валидация электронного адреса
      customValidator(value) {
        // Валидация наличия значения хотя бы в одном из полей email или phone
        if (!value && !this.phone) {
          throw new Error("Either email or phone must be provided.");
        }
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true, // Поле может быть пустым
    unique: true,
    validate: {
      customValidator(value) {
        // Валидация наличия значения хотя бы в одном из полей email или phone
        if (!value && !this.email) {
          throw new Error("Either email or phone must be provided.");
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = User;
