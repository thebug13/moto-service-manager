const db = require('./mysql');

const testProductosQuery = async () => {
  try {
    console.log('Intentando conectar a la base de datos...');
    // No necesitamos connect() explícito con mysql2 si usamos promise()

    console.log('Ejecutando consulta de productos...');
    const sqlProductos = 'SELECT * FROM productos';
    const [productosRows, productosFields] = await db.promise().query(sqlProductos);
    console.log('Resultado de la consulta de productos:', productosRows);

  } catch (error) {
    console.error('Error durante la consulta de productos:', error);
  } finally {
    // Cerrar la conexión al finalizar la prueba
    db.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err);
        return;
      }
      console.log('Conexión cerrada.');
    });
    console.log('Prueba finalizada.');
  }
};

testProductosQuery(); 