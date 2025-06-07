const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const categoriasController = require('../controllers/categorias.controller');
const productosController = require('../controllers/productos.controller');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/login', authController.login);

// Ruta de registro
router.post('/signup', authController.signup);

// Rutas de Categorías (proteger con middleware)
router.get('/categorias', authenticateToken, categoriasController.index);
router.post('/categorias', authenticateToken, authorizeRoles(['Administrador', 'Vendedor']), categoriasController.store);
router.get('/categorias/:id', authenticateToken, categoriasController.show);
router.put('/categorias/:id', authenticateToken, authorizeRoles(['Administrador']), categoriasController.update);
router.delete('/categorias/:id', authenticateToken, authorizeRoles(['Administrador']), categoriasController.destroy);

// Rutas de Productos (proteger con middleware)
router.get('/productos', authenticateToken, productosController.index);
router.post('/productos', authenticateToken, authorizeRoles(['Administrador', 'Vendedor']), productosController.store);
router.get('/productos/:id', authenticateToken, productosController.show);
router.put('/productos/:id', authenticateToken, authorizeRoles(['Administrador']), productosController.update);
router.delete('/productos/:id', authenticateToken, authorizeRoles(['Administrador']), productosController.destroy);

// Rutas de gestión de usuarios (solo para Administradores)
router.get('/users', authenticateToken, authorizeRoles(['Administrador']), userController.index);
router.put('/users/:id/role', authenticateToken, authorizeRoles(['Administrador']), userController.updateRole);

// TODO: Agregar ruta de contacto si se maneja en este archivo

module.exports = router; 