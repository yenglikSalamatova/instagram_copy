const express = require("express");
require("dotenv").config();
const passport = require("passport");
const jwtStrategy = require("./server/passport/jwtStrategy");
const { Sequelize } = require("sequelize");
const sequelize = require("./server/config/database");
const app = express();

const authRoutes = require("./server/routes/authRoutes");
const postRoutes = require("./server/routes/postRoutes");
const userRoutes = require("./server/routes/userRoutes");
const storiesRoutes = require("./server/routes/storiesRoutes");
const commentRoutes = require("./server/routes/commentRoutes");

// Подключаем файл с определениями ассоциаций
const associations = require("./server/models/associations");
associations(sequelize);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/comments", commentRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
