const express = require('express');
const router = express.Router();
const repuestoController = require('../controllers/repuestoController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Agregar repuesto a una reparación (todos los roles autenticados, pero con validación adicional en el controlador)
router.post('/reparacion/:reparacion_id', repuestoController.createRepuesto);

// Obtener repuestos de una reparación (todos los roles autenticados)
router.get('/reparacion/:reparacion_id', repuestoController.getRepuestosByReparacion);

// Calcular total de repuestos (todos los roles autenticados)
router.get('/reparacion/:reparacion_id/total', repuestoController.calcularTotal);

// Actualizar repuesto (todos los roles autenticados, pero con validación adicional en el controlador)
router.put('/:id', repuestoController.updateRepuesto);

// Eliminar repuesto (todos los roles autenticados, pero con validación adicional en el controlador)
router.delete('/:id', repuestoController.deleteRepuesto);

module.exports = router;