const express = require("express");
require("dotenv").config();
const passport = require("passport");
const jwtStrategy = require("./server/passport/jwtStrategy");

const app = express();

const authRoutes = require("./server/routes/authRoutes");

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
