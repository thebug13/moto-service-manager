const jwt = require('jsonwebtoken');

// Asumiendo que tienes la misma clave secreta que usaste para firmar el JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // ¡Debe coincidir con la clave usada para firmar!

const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization (formato: Bearer TOKEN)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, retornar 401 Unauthorized
    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    // Verificar el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Error de verificación de token:', err.message); // Añadir log para depuración
            // Si el token no es válido o ha expirado, retornar 403 Forbidden
            return res.sendStatus(403); // Forbidden
        }

        // Si el token es válido, adjuntar la información del usuario al request
        req.user = user; // El payload del token (id, email, etc.)
        
        // Continuar con el siguiente middleware o manejador de ruta
        next();
    });
};

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado: No tienes el rol necesario.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
}; 