const db = require('./mysql');

// Función para crear un nuevo cliente
const createCliente = (nombre, telefono) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO clientes (nombre, telefono) VALUES (?, ?)';
        db.query(query, [nombre, telefono])
            .then(result => {
                // Manejo robusto del insertId
                const insertId = result.insertId || (Array.isArray(result) && result[0] && result[0].insertId);
                console.log('Resultado de inserción de cliente:', result, 'insertId:', insertId);
                resolve({ id: insertId, nombre, telefono });
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener todos los clientes
const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM clientes';
        db.query(query)
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar un cliente por ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM clientes WHERE id = ?';
        db.query(query, [id])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para actualizar un cliente
const updateCliente = (id, nombre, telefono) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?';
        db.query(query, [nombre, telefono, id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para eliminar un cliente
const deleteCliente = (id) => {
    return new Promise((resolve, reject) => {
        // Primero verificar si el cliente tiene motos asociadas
        const checkQuery = 'SELECT COUNT(*) as count FROM motos WHERE cliente_id = ?';
        db.query(checkQuery, [id])
            .then(([rows]) => {
                if (rows[0].count > 0) {
                    reject({ message: 'No se puede eliminar el cliente porque tiene motos registradas' });
                    return;
                }
                // Si no tiene motos, proceder con la eliminación
                const deleteQuery = 'DELETE FROM clientes WHERE id = ?';
                return db.query(deleteQuery, [id]);
            })
            .then(result => {
                if (result && result[0]) {
                    resolve(result[0].affectedRows > 0);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Eliminar un cliente sin validación (solo para rollback interno)
const deleteClienteForce = (id) => {
    return new Promise((resolve, reject) => {
        const deleteQuery = 'DELETE FROM clientes WHERE id = ?';
        db.query(deleteQuery, [id])
            .then(result => {
                resolve(result[0]?.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    createCliente,
    findAll,
    findById,
    updateCliente,
    deleteCliente,
    deleteClienteForce
};