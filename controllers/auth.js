// controllers/auth.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const sendVerificationCodeToEmail = require("../utils/email");
const sendSms = require("../utils/sms");

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

const createNewUser = async (username, email, phone, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({
    username,
    email,
    phone,
    password: hashedPassword,
    isVerified: false,
  });
};

const createVerificationCode = async (userId) => {
  const code = generateVerificationCode(6);
  const expiresAt = calculateExpirationTime(10);
  const verificationCode = await VerificationCode.create({
    code,
    expiresAt,
    userId,
  });
  return verificationCode.code;
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const identifier = email ? "email" : "phone";

    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Either email or phone must be provided." });
    }

    const user = await createNewUser(username, email, phone, password);
    const code = await createVerificationCode(user.id);

    // Отправка кода через почту
    if (email) {
      const sended = await sendVerificationCodeToEmail(email, code);
      if (sended) {
        // Если письмо успешно отправлено, можно отправить статус успешно
        return res
          .status(200)
          .json({ message: "Verification code sent successfully." });
      } else {
        // Если письмо не отправлено из-за ошибки, можно отправить статус ошибки
        return res
          .status(500)
          .json({ error: "Failed to send verification code." });
      }
    }

    if (phone) {
      const sended = await sendSms(phone, `Your verification code is ${code}`);
      if (sended) {
        return res
          .status(200)
          .json({ message: "Verification code sent successfully." });
      } else {
        // Если письмо не отправлено из-за ошибки, можно отправить статус ошибки
        return res
          .status(500)
          .json({ error: "Failed to send verification code." });
      }
    }

    // Логика для отправки смс
    // ...
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  // Код для аутентификации пользователя
};

const verify = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = email ? "email" : "phone";

    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Either email or phone must be provided." });
    }

    const { code } = req.body;

    const user = await User.findOne({
      where: { [identifier]: email || phone },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verificationCode = await VerificationCode.findOne({
      where: { userId: user.id },
    });

    if (!verificationCode) {
      return res.status(404).json({ error: "Verification code not found" });
    }
    if (
      verificationCode.code === code &&
      new Date(verificationCode.expiresAt) >= new Date()
    ) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: "Verification successful" });
    } else {
      return res
        .status(401)
        .json({ error: "Invalid verification code or code has expired" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = email ? "email" : "phone";

    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Either email or phone must be provided." });
    }

    const user = await User.findOne({
      where: { [identifier]: email || phone },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verificationCode = await VerificationCode.findOne({
      where: { userId: user.id },
    });

    if (!verificationCode) {
      return res.status(404).json({ error: "Verification code not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Account is already verified" });
    }

    if (new Date(verificationCode.expiresAt) >= new Date()) {
      return res.status(400).json({
        error: "Verification code is still valid, please try again later",
      });
    }

    const newVerificationCode = await createVerificationCode(user.id);

    if (email) {
      const sended = await sendVerificationCodeToEmail(
        email,
        newVerificationCode
      );
      if (!sended) {
        return res
          .status(500)
          .json({ error: "Failed to send verification code" });
      }
    }

    return res
      .status(200)
      .json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  verify,
  resendVerificationCode,
};
