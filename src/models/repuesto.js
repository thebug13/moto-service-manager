const db = require('./mysql');

// Función para crear un nuevo repuesto
const createRepuesto = (reparacion_id, nombre, precio, cantidad) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO repuestos (reparacion_id, nombre, precio, cantidad) VALUES (?, ?, ?, ?)';
        db.query(query, [reparacion_id, nombre, precio, cantidad])
            .then(result => {
                resolve({ id: result.insertId, reparacion_id, nombre, precio, cantidad });
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener todos los repuestos de una reparación
const findByReparacionId = (reparacion_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM repuestos WHERE reparacion_id = ?';
        db.query(query, [reparacion_id])
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para calcular el total de repuestos de una reparación
const calcularTotalRepuestos = (reparacion_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT SUM(precio * cantidad) as total FROM repuestos WHERE reparacion_id = ?';
        db.query(query, [reparacion_id])
            .then(([rows]) => {
                resolve(rows[0].total || 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para actualizar un repuesto
const updateRepuesto = (id, nombre, precio, cantidad) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE repuestos SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';
        db.query(query, [nombre, precio, cantidad, id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para eliminar un repuesto
const deleteRepuesto = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM repuestos WHERE id = ?';
        db.query(query, [id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar un repuesto por ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM repuestos WHERE id = ?';
        db.query(query, [id])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    createRepuesto,
    findByReparacionId,
    calcularTotalRepuestos,
    updateRepuesto,
    deleteRepuesto,
    findById
};