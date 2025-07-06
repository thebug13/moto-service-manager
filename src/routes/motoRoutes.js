const express = require('express');
const router = express.Router();
const motoController = require('../controllers/motoController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Crear moto (todos los roles autenticados)
router.post('/', motoController.createMoto);

// Obtener todas las motos (todos los roles autenticados)
router.get('/', motoController.getAllMotos);

// Obtener moto por ID (todos los roles autenticados)
router.get('/id/:id', motoController.getMotoById);

// Obtener moto por placa (todos los roles autenticados)
router.get('/placa/:placa', motoController.getMotoByPlaca);

// Obtener motos por cliente (todos los roles autenticados)
router.get('/cliente/:cliente_id', motoController.getMotosByCliente);

// Actualizar moto (Administrador y Jefe de taller)
router.put('/:id', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    motoController.updateMoto
);

// Eliminar moto (solo Administrador)
router.delete('/:id', 
    authorizeRoles(['Administrador']), 
    motoController.deleteMoto
);

module.exports = router;