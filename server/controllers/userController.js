const User = require("../models/User");
require("../models/associations");

const editMe = async (req, res) => {
  const { full_name, email, phone, username, bio } = req.body;
  let profilePicture;

  if (req.file) {
    profilePicture = `/uploads/${req.user.id}/avatars/${req.file?.filename}`;
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
      attributes: { exclude: ["password"] },
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

module.exports = { editMe, getUserByUsername };
