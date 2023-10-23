const User = require("../models/User");
require("../models/associations");
const { Op } = require("sequelize");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const editMe = async (req, res) => {
  const { full_name, email, phone, username, bio } = req.body;
  let profilePicture;

  console.log(req.file);
  if (req.file) {
    const compressedMedia = await sharp(req.file.buffer)
      .resize(500, 500)
      .toBuffer();
    const uniqueFileName = `${Date.now()}_${req.file.originalname}`;

    const mediaDirectoryPath = path.join(
      __dirname,
      "../../public/uploads",
      `${req.user.id}`,
      "avatars"
    );

    // Создать директорию если такой нет
    if (!fs.existsSync(mediaDirectoryPath)) {
      fs.mkdirSync(mediaDirectoryPath, { recursive: true });
    }
    const filePath = path.join(mediaDirectoryPath, uniqueFileName);
    fs.writeFileSync(filePath, compressedMedia);

    profilePicture = `/uploads/${req.user.id}/avatars/${uniqueFileName}`;
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    // Обновить данные пользователя, если их длина больше 5 символов
    if (full_name && full_name.length >= 5) user.full_name = full_name;
    if (email && email.length >= 5) user.email = email;
    if (phone && phone.length >= 5) user.phone = phone;
    if (username && username.length >= 5) user.username = username;
    if (profilePicture && profilePicture.length >= 5)
      user.profilePicture = profilePicture;
    if (bio && bio.length >= 5) user.bio = bio;
    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when editing user" });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Находим пользователя по имени
    const user = await User.findOne({
      where: { username },
      attributes: {
        exclude: [
          "password",
          "isVerified",
          "phone",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Произошла ошибка при получении информации о пользователе",
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${q}%` } },
          { username: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: {
        exclude: [
          "password",
          "isVerified",
          "phone",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for users" });
  }
};

module.exports = { editMe, getUserByUsername, searchUsers };
