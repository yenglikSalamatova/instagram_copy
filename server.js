const express = require("express");
require("dotenv").config();
const passport = require("passport");
const jwtStrategy = require("./server/passport/jwtStrategy");

const app = express();

const authRoutes = require("./server/routes/authRoutes");
const postRoutes = require("./server/routes/postRoutes");

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
