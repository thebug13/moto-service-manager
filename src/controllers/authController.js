// Code developed by Felipe Loaiza - https://github.com/thebug13
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Asumiendo que tienes una clave secreta para firmar los JWT en tus variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // ¡Cambia esto por una clave segura en tu .env!

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario por email
        const user = await User.findUserByEmail(email);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña
        const isMatch = await User.comparePassword(password, user.password);

        // Si las contraseñas no coinciden
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Si las credenciales son correctas, generar JWT
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error al generar JWT:', err);
                return res.status(500).json({ message: 'Error al generar token' });
            }
            console.log('Token JWT generado:', token);
            res.json({ token });
        });
    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Función para registrar un nuevo usuario
const signup = async (req, res) => {
    const { email, password, role } = req.body; // Asegurarse de que el rol se reciba desde req.body

    try {
        const user = await User.createUser(email, password, role);

        // Generar un token JWT para el nuevo usuario
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Token:", token);

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (err) {
        if (err.message === 'El email ya está registrado') {
            return res.status(409).json({ message: err.message });
        }
        console.error('Error en el registro:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// TODO: Implementar función para verificar token (middleware)

module.exports = {
    login,
    signup,
    // TODO: Exportar otras funciones cuando se implementen
}; 