const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas públicas de autenticación
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Ruta protegida para verificar el token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Token válido', 
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;