// config/db

const mysql = require("mysql2/promise");

const mySqlPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password:
    process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : undefined,
  database: process.env.DB_NAME || "humanitarian_aid_db",
});

module.exports = mySqlPool;
