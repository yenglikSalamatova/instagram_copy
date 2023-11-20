const { Sequelize } = require("sequelize");
const config = require("./config");

const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize({
  ...config.development,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Обработчик успешного подключения
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Обработчик ошибки подключения
sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });

process.on("beforeExit", async () => {
  console.log("Closing database connection...");
  await sequelize.close();
  console.log("Database connection closed.");
});

module.exports = sequelize;
