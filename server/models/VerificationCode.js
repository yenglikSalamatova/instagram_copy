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

// Вспомогательная функция для генерации случайного кода подтверждения
const generateVerificationCode = (length) => {
  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

// Вспомогательная функция для вычисления срока действия кода подтверждения
const calculateExpirationTime = (minutes) => {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + minutes);
  return expirationDate;
};

const createVerificationCode = async (userId) => {
  const code = generateVerificationCode(6);
  const expiresIn = calculateExpirationTime(10);
  const verificationCode = await VerificationCode.create({
    code,
    expiresIn,
    userId,
  });
  return verificationCode.code;
};

module.exports = { createVerificationCode, VerificationCode };
