const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.dbname,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
