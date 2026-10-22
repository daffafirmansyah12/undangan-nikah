const mysql = require('mysql2/promise');

// Di laptop (XAMPP) memakai nilai bawaan di bawah.
// Saat online, nilainya diambil dari environment variable di Render.
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'undangan_db',
  waitForConnections: true,
  connectionLimit: 5
};

// Database online (Aiven) mewajibkan SSL
if (process.env.DB_SSL === 'true') {
  config.ssl = process.env.DB_CA
    ? { ca: process.env.DB_CA }
    : { rejectUnauthorized: false };
}

module.exports = mysql.createPool(config);
