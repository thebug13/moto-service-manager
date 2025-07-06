// Code developed by Felipe Loaiza - https://github.com/thebug13
const db = require('./mysql');
const bcrypt = require('bcryptjs');

// Función para encontrar un usuario por email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para comparar la contraseña proporcionada con la contraseña hasheada de la base de datos
const comparePassword = (providedPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(providedPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            resolve(isMatch);
        });
    });
};

// Función para crear un nuevo usuario
const createUser = (email, password, role = 'Auxiliar', nombre_auxiliar = '') => {
    return new Promise((resolve, reject) => {
        // Primero, hashear la contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return reject(err);
            }

            // Insertar el nuevo usuario en la base de datos
            const query = 'INSERT INTO users (email, password, role, nombre_auxiliar) VALUES (?, ?, ?, ?)';
            db.query(query, [email, hashedPassword, role, nombre_auxiliar])
                .then(result => {
                    resolve({ id: result.insertId, email: email, role: role, nombre_auxiliar });
                })
                .catch(err => {
                    // Manejar error si el email ya existe (por ejemplo, error de clave única)
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ message: 'El email ya está registrado' });
                    }
                    reject(err);
                });
        });
    });
};

// Función para obtener todos los usuarios
const findAll = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, email, role, nombre_auxiliar FROM users';
        db.query(query)
            .then(([rows]) => {
                resolve(rows);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para actualizar el rol de un usuario
const updateRole = (id, newRole) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET role = ? WHERE id = ?';
        db.query(query, [newRole, id])
            .then(result => {
                resolve(result.affectedRows); // Devuelve cuántas filas fueron afectadas
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Función para encontrar un usuario por ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, email, role FROM users WHERE id = ?';
        db.query(query, [id])
            .then(([rows]) => {
                resolve(rows.length > 0 ? rows[0] : null);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// Editar usuario
const updateUser = (id, email, password, role, nombre_auxiliar) => {
    return new Promise((resolve, reject) => {
        let query, params;
        if (password) {
            // Si se provee nueva contraseña, hashearla
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return reject(err);
                query = 'UPDATE users SET email = ?, password = ?, role = ?, nombre_auxiliar = ? WHERE id = ?';
                params = [email, hashedPassword, role, nombre_auxiliar, id];
                db.query(query, params)
                    .then(result => resolve(result.affectedRows > 0))
                    .catch(err => reject(err));
            });
        } else {
            // Sin cambio de contraseña
            query = 'UPDATE users SET email = ?, role = ?, nombre_auxiliar = ? WHERE id = ?';
            params = [email, role, nombre_auxiliar, id];
            db.query(query, params)
                .then(result => resolve(result.affectedRows > 0))
                .catch(err => reject(err));
        }
    });
};

// Eliminar usuario
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM users WHERE id = ?';
        db.query(query, [id])
            .then(result => resolve(result.affectedRows > 0))
            .catch(err => reject(err));
    });
};

module.exports = {
    findUserByEmail,
    comparePassword,
    createUser,
    findAll,
    updateRole,
    findById,
    updateUser,
    deleteUser
};