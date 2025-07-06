const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Generar factura (Administrador y Jefe de taller)
router.post('/reparacion/:reparacion_id', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    facturaController.createFactura
);

// Obtener todas las facturas (Administrador y Jefe de taller)
router.get('/', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    facturaController.getAllFacturas
);

// Obtener factura por ID (todos los roles autenticados)
router.get('/:id', facturaController.getFacturaById);

// Obtener facturas por cliente (todos los roles autenticados)
router.get('/cliente/:cliente_id', facturaController.getFacturasByCliente);

// Marcar factura como pagada (Administrador y Jefe de taller)
router.put('/:id/pagar', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    facturaController.marcarComoPagada
);

module.exports = router;