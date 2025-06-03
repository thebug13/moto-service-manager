const db = require('./mysql'); // Ahora es un pool de promesas

const create = async (nombre) => {
  const sql = `INSERT INTO categorias (nombre) VALUES (?)`;
  try {
    const [results] = await db.query(sql, [nombre]);
    return results.insertId;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  const sql = `SELECT * FROM categorias`;
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  const sql = `SELECT * FROM categorias WHERE id = ?`;
  try {
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const update = async (id, nombre) => {
  const sql = `UPDATE categorias SET nombre = ? WHERE id = ?`;
  try {
    const [results] = await db.query(sql, [nombre, id]);
    return results.affectedRows;
  } catch (error) {
    throw error;
  }
};

const destroy = async (id) => {
  const sql = `DELETE FROM categorias WHERE id = ?`;
  try {
    const [results] = await db.query(sql, [id]);
    return results.affectedRows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  destroy,
};
