const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let connection;

async function createConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('¡Conexión exitosa');
  } catch (err) {
    console.error('Error al conectar a MySQL:', err);
  }
}

createConnection();

module.exports = () => connection;
