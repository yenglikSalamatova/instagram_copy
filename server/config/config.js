const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  development: {
    username: "admin",
    password: "root",
    database: "database_development",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "admin",
    password: "root",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "doadmin",
    password: process.env.VPS_DATABASE_PASS,
    database: "instagram_db",
    host: "db-postgresql-fra1-44132-do-user-14536331-0.b.db.ondigitalocean.com",
    dialect: "postgres",
    port: 25060,
    sslmode: "require",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(
          path.resolve("server", "config", "ca-certificate.crt")
        ),
      },
    },
  },
};
