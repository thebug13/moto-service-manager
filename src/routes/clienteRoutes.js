const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Crear cliente (todos los roles autenticados)
router.post('/', clienteController.createCliente);

// Obtener todos los clientes (todos los roles autenticados)
router.get('/', clienteController.getAllClientes);

// Obtener cliente por ID (todos los roles autenticados)
router.get('/:id', clienteController.getClienteById);

// Actualizar cliente (Administrador y Jefe de taller)
router.put('/:id', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    clienteController.updateCliente
);

// Eliminar cliente (solo Administrador)
router.delete('/:id', 
    authorizeRoles(['Administrador']), 
    clienteController.deleteCliente
);

module.exports = router;