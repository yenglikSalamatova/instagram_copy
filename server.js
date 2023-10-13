const https = require("https");
const fs = require("fs");
const express = require("express");
require("dotenv").config();
const passport = require("passport");
const jwtStrategy = require("./server/passport/jwtStrategy");
const sequelize = require("./server/config/database");
const cors = require("cors");
const path = require("path");
const app = express();

const authRoutes = require("./server/routes/authRoutes");
const postRoutes = require("./server/routes/postRoutes");
const userRoutes = require("./server/routes/userRoutes");
const storiesRoutes = require("./server/routes/storiesRoutes");
const commentRoutes = require("./server/routes/commentRoutes");
const subscriptionRoutes = require("./server/routes/subscriptionRoutes");
const likeRoutes = require("./server/routes/likeRoutes");

// Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/likes", likeRoutes);

const options = {
  key: fs.readFileSync("backend.key"),
  cert: fs.readFileSync("backend.crt"),
};

const server = https.createServer(options, app);

server.listen(3000, () => {
  console.log("Server is listening on port 3000 with SSL certificate");
});
