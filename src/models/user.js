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
const createUser = (email, password, role = 'Vendedor') => {
    return new Promise((resolve, reject) => {
        // Primero, hashear la contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return reject(err);
            }

            // Insertar el nuevo usuario en la base de datos
            const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
            db.query(query, [email, hashedPassword, role])
                .then(result => {
                    resolve({ id: result.insertId, email: email, role: role });
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
        const query = 'SELECT id, email, role FROM users';
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

// TODO: Agregar función para encontrar usuario por ID

module.exports = {
    findUserByEmail,
    comparePassword,
    createUser,
    findAll,
    updateRole,
    // TODO: Exportar otras funciones cuando se implementen
}; 