const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: 5432,
    dialect: "postgres",
    ssl: "require",
    connection: {
      options: `project=${process.env.ENDPOINT_ID}`,
    },
  },
  test: {
    username: "admin",
    password: "root",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: 5432,
    dialect: "postgres",
    ssl: "require",
    connection: {
      options: `project=${process.env.ENDPOINT_ID}`,
    },
  },
};
