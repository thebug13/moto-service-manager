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

        // Verificar si el usuario existe y tiene una contraseña
        if (!user || !user.password) {
            // Log para depuración. No exponer si el usuario existe o no.
            console.error(`Intento de login para el email: ${email}. El usuario no fue encontrado o no tiene una contraseña en la BD.`);
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
            role: user.role,
            nombre_auxiliar: user.nombre_auxiliar
        };

        // Usar la versión síncrona de jwt.sign dentro de un bloque async
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        console.log('Token JWT generado:', token);
        res.json({ token });
    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Función para registrar un nuevo usuario
const signup = async (req, res) => {
    const { email, password, role, nombre_auxiliar } = req.body; // Asegurarse de que el nombre_auxiliar se reciba desde req.body

    // Validar que se recibieron los datos necesarios
    if (!email || !password || !nombre_auxiliar) {
        return res.status(400).json({ message: 'El email, la contraseña y el nombre son obligatorios.' });
    }

    try {
        const user = await User.createUser(email, password, role, nombre_auxiliar);

        // Generar un token JWT para el nuevo usuario
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, nombre_auxiliar: user.nombre_auxiliar }, process.env.JWT_SECRET, { expiresIn: '1h' });
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