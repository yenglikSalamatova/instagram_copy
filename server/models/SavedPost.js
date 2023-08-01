// models/SavedPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const SavedPost = sequelize.define("SavedPost", {});

module.exports = SavedPost;
