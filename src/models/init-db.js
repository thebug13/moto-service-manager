const mysql = require('mysql2');

// Primero creamos una conexión sin base de datos
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || ''
});

// Función para ejecutar las consultas en secuencia
const initDatabase = async () => {
  try {
    // Crear la base de datos si no existe
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS crud_node');
    console.log('Base de datos creada o ya existente');

    // Usar la base de datos
    await connection.promise().query('USE crud_node');
    console.log('Base de datos seleccionada');

    // Crear tabla de categorías
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL
      )
    `);
    console.log('Tabla categorias creada o ya existente');

    // Crear tabla de productos
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        categoria_id INT,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      )
    `);
    console.log('Tabla productos creada o ya existente');

  } catch (err) {
    console.error('Error durante la inicialización:', err);
  } finally {
    // Cerrar la conexión
    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err);
        return;
      }
      console.log('Conexión cerrada');
    });
  }
};

// Ejecutar la inicialización
initDatabase(); 