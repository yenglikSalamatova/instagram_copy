const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/User");
const secretKey = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Извлечение userId из payload
    const { userId } = payload;

    // Поиск пользователя в базе данных по userId
    const user = await User.findByPk(userId);

    // Если пользователь найден, передаем его в коллбэк done
    if (user) {
      return done(null, user);
    }

    // Если пользователь не найден, передаем false в коллбэк done
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = jwtStrategy;
