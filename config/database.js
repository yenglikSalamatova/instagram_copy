const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("instagram_db_development", "admin", "root", {
  host: "127.0.0.1",
  dialect: "postgres",
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
  .sync() // Это может помочь обнаружить ошибку подключения к базе данных при выполнении первичной синхронизации моделей.
  .then(() => {
    console.log("Models synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });

module.exports = sequelize;
