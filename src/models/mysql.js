const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'crud_node',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ya no necesitamos el bloque getConnection aquí porque el pool mismo es promise-aware
/*
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a MySQL pool:', err);
    return;
  }
  console.log('Conectado a MySQL pool exitosamente');
  connection.release();
});
*/

module.exports = pool;