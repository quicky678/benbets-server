const { Client } = require("pg");
require("dotenv").config();

// Create a pool to handle multiple connections
const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to the database
pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Export the pool for use in other modules
module.exports = pool;
