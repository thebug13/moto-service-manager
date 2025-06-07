const db = require('../config/db'); // Asumiendo que tienes un archivo de configuración de DB
const bcrypt = require('bcryptjs');

// Función para encontrar un usuario por email
const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        // Si encuentra un usuario, devuelve el primero (el email debe ser único)
        callback(null, results.length > 0 ? results[0] : null);
    });
};

// Función para comparar la contraseña proporcionada con la contraseña hasheada de la base de datos
const comparePassword = (providedPassword, hashedPassword, callback) => {
    bcrypt.compare(providedPassword, hashedPassword, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

// Función para crear un nuevo usuario
const createUser = (email, password, role = 'Vendedor', callback) => {
    // Primero, hashear la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        db.query(query, [email, hashedPassword, role], (err, result) => {
            if (err) {
                // Manejar error si el email ya existe (por ejemplo, error de clave única)
                if (err.code === 'ER_DUP_ENTRY') {
                    return callback({ message: 'El email ya está registrado' }, null);
                }
                return callback(err, null);
            }
            // Devolver el ID del usuario recién creado
            callback(null, { id: result.insertId, email: email, role: role });
        });
    });
};

// Función para obtener todos los usuarios
const findAll = (callback) => {
    const query = 'SELECT id, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Función para actualizar el rol de un usuario
const updateRole = (id, newRole, callback) => {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(query, [newRole, id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result.affectedRows); // Devuelve cuántas filas fueron afectadas
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