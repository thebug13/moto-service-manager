const db = require('./mysql');

// Función para crear una nueva moto
const createMoto = (placa, marca, modelo, cliente_id) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO motos (placa, marca, modelo, cliente_id) VALUES (?, ?, ?, ?)';
        db.query(query, [placa, marca, modelo, cliente_id])
            .then(result => {
                resolve({ id: result.insertId, placa, marca, modelo, cliente_id });
            })
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    reject({ message: 'La placa ya está registrada' });
                } else {
                    reject(err);
                }
            });
    });
};

// Función para obtener todas las motos con información del cliente
const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono 
            FROM motos m 
            JOIN clientes c ON m.cliente_id = c.id
        `;
        db.query(query)
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar una moto por ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono 
            FROM motos m 
            JOIN clientes c ON m.cliente_id = c.id 
            WHERE m.id = ?
        `;
        db.query(query, [id])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar una moto por placa
const findByPlaca = (placa) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono 
            FROM motos m 
            JOIN clientes c ON m.cliente_id = c.id 
            WHERE m.placa = ?
        `;
        db.query(query, [placa])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para actualizar una moto
const updateMoto = (id, placa, marca, modelo, cliente_id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE motos SET placa = ?, marca = ?, modelo = ?, cliente_id = ? WHERE id = ?';
        db.query(query, [placa, marca, modelo, cliente_id, id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    reject({ message: 'La placa ya está registrada' });
                } else {
                    reject(err);
                }
            });
    });
};

// Función para eliminar una moto
const deleteMoto = (id) => {
    return new Promise((resolve, reject) => {
        // Primero verificar si la moto tiene reparaciones asociadas
        const checkQuery = 'SELECT COUNT(*) as count FROM reparaciones WHERE moto_id = ?';
        db.query(checkQuery, [id])
            .then(([rows]) => {
                if (rows[0].count > 0) {
                    reject({ message: 'No se puede eliminar la moto porque tiene reparaciones registradas' });
                    return;
                }
                // Si no tiene reparaciones, proceder con la eliminación
                const deleteQuery = 'DELETE FROM motos WHERE id = ?';
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

// Función para obtener todas las motos de un cliente
const findByClienteId = (cliente_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono 
            FROM motos m 
            JOIN clientes c ON m.cliente_id = c.id 
            WHERE m.cliente_id = ?
        `;
        db.query(query, [cliente_id])
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    createMoto,
    findAll,
    findById,
    findByPlaca,
    updateMoto,
    deleteMoto,
    findByClienteId
};