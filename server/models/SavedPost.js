// models/SavedPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SavedPost = sequelize.define("SavedPost", {});

module.exports = SavedPost;
