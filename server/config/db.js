const mysql  = require('mysql2/promise');
require('dotenv').config();

// pool מאפשר שימוש חוזר בחיבורים במקום לפתוח חיבור חדש לכל שאילתה
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               process.env.DB_PORT,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASS,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
});

module.exports = pool;
