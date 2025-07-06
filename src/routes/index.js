const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/auth/login', authController.login);

// Ruta de registro
router.post('/auth/signup', authController.signup);

// Rutas de gestión de usuarios (solo para Administradores)
router.get('/users', authenticateToken, authorizeRoles(['Administrador']), userController.index);
router.put('/users/:id/role', authenticateToken, authorizeRoles(['Administrador']), userController.updateRole);
router.post('/users', authenticateToken, authorizeRoles(['Administrador']), userController.create);
router.put('/users/:id', authenticateToken, authorizeRoles(['Administrador']), userController.update);
router.delete('/users/:id', authenticateToken, authorizeRoles(['Administrador']), userController.remove);

// TODO: Agregar ruta de contacto si se maneja en este archivo

module.exports = router; 