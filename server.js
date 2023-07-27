const express = require("express");
const passport = require("passport");
const jwtStrategy = require("./passport/jwtStrategy");

const clearTables = require("./utils/clearTables");

// Очистка базы данных
// clearTables.clearVerificationCodesTable();
// clearTables.clearUsersTable();

const app = express();

const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");

dotenv.config({ path: "./config.env" });

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
