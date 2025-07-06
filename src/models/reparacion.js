const db = require('./mysql');

// Función para crear una nueva reparación
const createReparacion = (moto_id, auxiliar_id, mano_obra = 0) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO reparaciones (moto_id, auxiliar_id, fecha_ingreso, mano_obra) VALUES (?, ?, NOW(), ?)';
        db.query(query, [moto_id, auxiliar_id, mano_obra])
            .then(result => {
                resolve({ id: result.insertId, moto_id, auxiliar_id, mano_obra });
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener todas las reparaciones con información detallada
const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono,
                   u.nombre_auxiliar as nombre_auxiliar, u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN users u ON r.auxiliar_id = u.id
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query)
            .then(([rows]) => {
                console.log('REPARACIONES SQL RESULT:', rows);
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar una reparación por ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono,
                   u.nombre_auxiliar as nombre_auxiliar, u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE r.id = ?
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

// Función para actualizar el diagnóstico
const updateDiagnostico = (id, diagnostico) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE reparaciones SET diagnostico = ?, estado = "diagnosticada" WHERE id = ?';
        db.query(query, [diagnostico, id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para actualizar el estado de la reparación
const updateEstado = (id, estado) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE reparaciones SET estado = ? WHERE id = ?';
        db.query(query, [estado, id])
            .then(result => {
                resolve(result.affectedRows > 0);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener reparaciones por auxiliar
const findByAuxiliarId = (auxiliar_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono,
                   u.nombre_auxiliar as nombre_auxiliar, u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE r.auxiliar_id = ?
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query, [auxiliar_id])
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener reparaciones por moto
const findByMotoId = (moto_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono,
                   u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE r.moto_id = ?
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query, [moto_id])
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Historial de reparaciones por cliente
const findHistorialByCliente = (cliente_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo, u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE m.cliente_id = ?
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query, [cliente_id])
            .then(([rows]) => resolve(rows))
            .catch(err => reject(err));
    });
};

// Historial de reparaciones por moto
const findHistorialByMoto = (moto_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, m.placa, m.marca, m.modelo, u.email as auxiliar_email
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE r.moto_id = ?
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query, [moto_id])
            .then(([rows]) => resolve(rows))
            .catch(err => reject(err));
    });
};

// Reporte de motos atendidas por auxiliar
const reporteMotosPorAuxiliar = (auxiliar_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.id as moto_id, m.placa, m.marca, m.modelo, COUNT(r.id) as total_reparaciones
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            WHERE r.auxiliar_id = ?
            GROUP BY m.id, m.placa, m.marca, m.modelo
            ORDER BY total_reparaciones DESC
        `;
        db.query(query, [auxiliar_id])
            .then(([rows]) => resolve(rows))
            .catch(err => reject(err));
    });
};

// Función para actualizar solo el campo mano_obra
const updateManoObra = (id, mano_obra) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE reparaciones SET mano_obra = ? WHERE id = ?';
        db.query(query, [mano_obra, id])
            .then(result => {
                resolve(true);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Sumar mano de obra por auxiliar y rango de fechas
const sumManoObraPorAuxiliar = (desde, hasta) => {
    // Asegura que la fecha final incluya todo el día
    let hastaCompleto = hasta;
    if (hasta.length === 10) {
        hastaCompleto = hasta + ' 23:59:59';
    }
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.auxiliar_id, u.nombre_auxiliar, SUM(r.mano_obra) as total_mano_obra
            FROM reparaciones r
            JOIN users u ON r.auxiliar_id = u.id
            WHERE r.fecha_ingreso BETWEEN ? AND ?
            GROUP BY r.auxiliar_id, u.nombre_auxiliar
        `;
        db.query(query, [desde, hastaCompleto])
            .then(([rows]) => resolve(rows))
            .catch(err => reject(err));
    });
};

// Obtener reparaciones detalladas por auxiliar y rango de fechas
const getReparacionesDetalladasPorAuxiliar = (auxiliar_id, desde, hasta) => {
    // Asegura que la fecha final incluya todo el día
    let hastaCompleto = hasta;
    if (hasta.length === 10) {
        hastaCompleto = hasta + ' 23:59:59';
    }
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.id, r.fecha_ingreso, r.diagnostico, r.estado, r.mano_obra,
                   m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono
            FROM reparaciones r
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            WHERE r.auxiliar_id = ? AND r.fecha_ingreso BETWEEN ? AND ?
            ORDER BY r.fecha_ingreso DESC
        `;
        db.query(query, [auxiliar_id, desde, hastaCompleto])
            .then(([rows]) => resolve(rows))
            .catch(err => reject(err));
    });
};

module.exports = {
    createReparacion,
    findAll,
    findById,
    updateDiagnostico,
    updateEstado,
    findByAuxiliarId,
    findByMotoId,
    findHistorialByCliente,
    findHistorialByMoto,
    reporteMotosPorAuxiliar,
    updateManoObra,
    sumManoObraPorAuxiliar,
    getReparacionesDetalladasPorAuxiliar
};
