const { Sequelize } = require("sequelize");
const config = require("./config.json");

const sequelize = new Sequelize(
  config[process.env.NODE_ENV].database,
  config[process.env.NODE_ENV].username,
  config[process.env.NODE_ENV].password,
  {
    host: config[process.env.NODE_ENV].host,
    dialect: config[process.env.NODE_ENV].dialect,
  }
);

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
  .sync() // Это может помочь обнаружить ошибку подключения к базе данных при выполнении первичной синхронизации моделей.
  .then(() => {
    console.log("Models synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });

module.exports = sequelize;
