const User = require("../models/User");

const editMe = async (req, res) => {
  const { full_name, email, phone, username, bio } = req.body;
  const profilePicture = `/uploads/${req.user.id}/avatars/${req.file.filename}`;
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    // Обновить данные пользователя, если их длина больше 5 символов
    if (full_name && full_name.length > 5) user.full_name = full_name;
    if (email && email.length > 5) user.email = email;
    if (phone && phone.length > 5) user.phone = phone;
    if (username && username.length > 5) user.username = username;
    if (profilePicture && profilePicture.length > 5)
      user.profilePicture = profilePicture;
    if (bio && bio.length > 5) user.bio = bio;
    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when editing user" });
  }
};

module.exports = { editMe };
