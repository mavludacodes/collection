require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: `${process.env.DB_USER}`,
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DATABASE_NAME}`,
  password: `${process.env.DB_PASSWORD}`,
  port: `${process.env.DB_PORT}`,
});

// const pool = new Pool({
//   connectionString: `${process.env.DATABASE_URI}`,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

module.exports = { pool };
