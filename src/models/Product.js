const pool = require("./mysql");

const store = async (nombre, precio, categoria_id) => {
  const sql = `INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)`;

  try {
    console.log('Ejecutando Product.store:', nombre, precio, categoria_id); // Logging
    const [result] = await pool.query(sql, [nombre, precio, categoria_id]);
    console.log('Resultado de Product.store:', result); // Logging
    return result;
  } catch (error) {
    console.error('Error en Product.store:', error); // Logging detallado
    throw error;
  }
};

const findAll = async () => {
  const sql = "SELECT * FROM productos";

  try {
    console.log('Ejecutando Product.findAll...'); // Logging
    const [rows] = await pool.query(sql);
    console.log('Resultado de Product.findAll:', rows); // Logging
    return rows;
  } catch (error) {
    console.error('Error en Product.findAll:', error); // Logging detallado
    throw error;
  }
};

const findById = async (id) => {
  const sql = `SELECT * FROM productos WHERE id = ?`;

  try {
    console.log('Ejecutando Product.findById:', id); // Logging
    const [rows] = await pool.query(sql, [id]);
    console.log('Resultado de Product.findById:', rows); // Logging
    // console.log(rows, rows.shift())
    return rows.shift();
  } catch (error) {
    console.error('Error en Product.findById:', error); // Logging detallado
    throw error;
  }
};

const update = async (id, nombre, precio, categoria_id) => {
  const sql = `UPDATE productos SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?`;

  try {
    console.log('Ejecutando Product.update:', id, nombre, precio, categoria_id); // Logging
    const [result] = await pool.query(sql, [nombre, precio, categoria_id, id]);
    console.log('Resultado de Product.update:', result); // Logging
    return result;
  } catch (error) {
    console.error('Error en Product.update:', error); // Logging detallado
    throw error;
  }
};

const destroy = async (id) => {
  const sql = `DELETE FROM productos WHERE id = ?`;

  try {
    console.log('Ejecutando Product.destroy:', id); // Logging
    const [result] = await pool.query(sql, [id]);
    console.log('Resultado de Product.destroy:', result); // Logging
    return result;
  } catch (error) {
    console.error('Error en Product.destroy:', error); // Logging detallado
    throw error;
  }
};

module.exports = {
  store,
  findAll,
  findById,
  update,
  destroy,
};