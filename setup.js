// setup.js

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const initialConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password:
    typeof process.env.DB_PASSWORD === "string"
      ? process.env.DB_PASSWORD
      : undefined,
  multipleStatements: true,
};

const dbConfig = {
  ...initialConfig,
  database: process.env.DB_NAME || "humanitarian_aid_db",
};

async function setupDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection(initialConfig);
    console.log("Connected to MySQL server");

    console.log("Creating database if not exists...");
    await connection.query("CREATE DATABASE IF NOT EXISTS humanitarian_aid_db");
    await connection.query("USE humanitarian_aid_db");

    console.log("Creating tables...");
    const schemaScript = fs.readFileSync(
      path.join(__dirname, "database.schema.sql"),
      "utf8"
    );
    await connection.query(schemaScript);
    console.log("Tables created successfully");

    console.log("Populating database with sample data...");
    const dataScript = fs.readFileSync(
      path.join(__dirname, "fictitious_data.sql"),
      "utf8"
    );
    await connection.query(dataScript);
    console.log("Sample data inserted successfully");

    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

setupDatabase();
