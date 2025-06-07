const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Asumiendo que tienes una clave secreta para firmar los JWT en tus variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // ¡Cambia esto por una clave segura en tu .env!

const login = (req, res) => {
    const { email, password } = req.body;

    // 1. Buscar el usuario por email
    User.findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseña:', err);
                return res.status(500).json({ message: 'Error del servidor' });
            }

            // Si las contraseñas no coinciden
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // 3. Si las credenciales son correctas, generar JWT
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role
                // Puedes añadir más datos relevantes aquí, pero evita información sensible
            };

            jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error('Error al generar JWT:', err);
                    return res.status(500).json({ message: 'Error al generar token' });
                }

                // 4. Enviar el token en la respuesta
                console.log('Token JWT generado:', token);
                res.json({ token });
            });
        });
    });
};

// Función para registrar un nuevo usuario
const signup = (req, res) => {
    const { email, password } = req.body;

    User.createUser(email, password, undefined, (err, user) => {
        if (err) {
            if (err.message === 'El email ya está registrado') {
                return res.status(409).json({ message: err.message });
            }
            console.error('Error en el registro:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Generar un token JWT para el nuevo usuario
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Token:", token);

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    });
};

// TODO: Implementar función para verificar token (middleware)

module.exports = {
    login,
    signup, // Exportar la nueva función de registro
    // TODO: Exportar otras funciones cuando se implementen
}; 