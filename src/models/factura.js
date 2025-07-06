const db = require('./mysql');

// Función para crear una nueva factura
const createFactura = (reparacion_id, mano_obra) => {
    return new Promise((resolve, reject) => {
        // Primero calculamos el total de repuestos
        const queryRepuestos = 'SELECT SUM(precio * cantidad) as total_repuestos FROM repuestos WHERE reparacion_id = ?';
        db.query(queryRepuestos, [reparacion_id])
            .then(([rows]) => {
                const total_repuestos = rows[0].total_repuestos || 0;
                const total = parseFloat(mano_obra) + parseFloat(total_repuestos);
                
                // Insertamos la factura
                const query = 'INSERT INTO facturas (reparacion_id, fecha, mano_obra, total) VALUES (?, NOW(), ?, ?)';
                return db.query(query, [reparacion_id, mano_obra, total]);
            })
            .then(result => {
                // Actualizamos el estado de la reparación
                const updateQuery = 'UPDATE reparaciones SET estado = "facturada" WHERE id = ?';
                return db.query(updateQuery, [reparacion_id])
                    .then(() => result);
            })
            .then(result => {
                resolve({ id: result[0].insertId });
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener una factura por ID con detalles
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT f.*, r.fecha_ingreso, r.diagnostico,
                   m.placa, m.marca, m.modelo,
                   c.nombre as cliente_nombre, c.telefono as cliente_telefono,
                   u.email as auxiliar_email
            FROM facturas f
            JOIN reparaciones r ON f.reparacion_id = r.id
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN users u ON r.auxiliar_id = u.id
            WHERE f.id = ?
        `;
        db.query(query, [id])
            .then(([rows]) => {
                if (rows.length === 0) {
                    resolve(null);
                    return;
                }
                
                // Obtenemos los repuestos de la reparación
                const queryRepuestos = 'SELECT * FROM repuestos WHERE reparacion_id = ?';
                db.query(queryRepuestos, [rows[0].reparacion_id])
                    .then(([repuestos]) => {
                        const factura = rows[0];
                        factura.repuestos = repuestos;
                        resolve(factura);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para marcar una factura como pagada
const marcarComoPagada = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE facturas SET estado = "pagada" WHERE id = ?';
        db.query(query, [id])
            .then(result => {
                if (result.affectedRows > 0) {
                    // Actualizamos el estado de la reparación a entregada
                    const updateQuery = 'UPDATE reparaciones SET estado = "entregada" WHERE id = (SELECT reparacion_id FROM facturas WHERE id = ?)';
                    return db.query(updateQuery, [id]);
                }
                resolve(false);
            })
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para obtener todas las facturas
const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT f.*, r.fecha_ingreso,
                   m.placa, c.nombre as cliente_nombre
            FROM facturas f
            JOIN reparaciones r ON f.reparacion_id = r.id
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            ORDER BY f.fecha DESC
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

// Función para obtener facturas por cliente
const findByClienteId = (cliente_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT f.*, r.fecha_ingreso,
                   m.placa, c.nombre as cliente_nombre
            FROM facturas f
            JOIN reparaciones r ON f.reparacion_id = r.id
            JOIN motos m ON r.moto_id = m.id
            JOIN clientes c ON m.cliente_id = c.id
            WHERE c.id = ?
            ORDER BY f.fecha DESC
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
    createFactura,
    findById,
    marcarComoPagada,
    findAll,
    findByClienteId
};