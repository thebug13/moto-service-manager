const mysql = require('mysql2');

// Crear una conexión al base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost', // Lee del .env, por defecto localhost
  user: process.env.MYSQL_USER || 'root',       // Lee del .env, por defecto root
  password: process.env.MYSQL_PASSWORD || '123456', // Lee del .env, por defecto vacío
  database: process.env.MYSQL_DATABASE || 'crud_node' // Lee del .env, por defecto crud_node
});

// Conectar al base de datos
connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

// Exportar la conexión
module.exports = connection; 