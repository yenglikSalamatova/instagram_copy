const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("../models/associations");

const {
  VerificationCode,
  createVerificationCode,
} = require("../models/VerificationCode");

const sendEmail = require("../utils/email");
const sendSms = require("../utils/sms");

const register = async (req, res) => {
  try {
    const { username, email, full_name, phone, password, birthday_date } =
      req.body;
    const identifier = email ? "email" : "phone";

    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Either email or phone must be provided." });
    }
    // Проверяем, существует ли пользователь с таким же именем пользователя или email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          username ? { username } : null,
          phone ? { phone } : null,
        ],
      },
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: "User already exists." });
    }

    const birthdayDateISO = new Date(birthday_date).toISOString();

    const user = await User.create({
      username,
      full_name,
      email,
      phone,
      birthday_date: birthdayDateISO,
      password: await bcrypt.hash(password, 10),
      isVerified: false,
      profilePicture: "/default_avatar.webp",
    });

    const code = await createVerificationCode(user.id);

    // Отправка кода через почту
    if (email) {
      const sended = await sendEmail(email, code);
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

    // Логика для отправки смс
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
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, username, phone, password } = req.body;

  if (!email && !username && !phone) {
    return res
      .status(400)
      .json({ error: "Either email, phone, or username must be provided." });
  }
  if (!password) {
    return res.status(400).json({ error: "Password must be provided." });
  }
  try {
    const identifier = email || username || phone;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          username ? { username } : null,
          phone ? { phone } : null,
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if (!user.isVerified) {
      return res.status(404).json({
        error: "You're not verified. Please register your account again",
      });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          birthday_date: user.birthday_date,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

    console.log(verificationCode.code, code);

    if (!verificationCode) {
      return res.status(404).json({ error: "Verification code not found" });
    }
    if (
      verificationCode.code === code &&
      new Date(verificationCode.expiresIn) >= new Date()
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

    if (new Date(verificationCode.expiresIn) >= new Date()) {
      return res.status(400).json({
        error: "Verification code is still valid, please try again later",
      });
    }

    const newVerificationCode = await createVerificationCode(user.id);

    if (email) {
      const sended = await sendEmail(email, newVerificationCode);
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
