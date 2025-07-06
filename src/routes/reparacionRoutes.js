const express = require('express');
const router = express.Router();
const reparacionController = require('../controllers/reparacionController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Crear reparación (Administrador, Jefe de taller y Auxiliar)
router.post('/', 
    authorizeRoles(['Administrador', 'Jefe de taller', 'Auxiliar']), 
    reparacionController.createReparacion
);

// Obtener todas las reparaciones (todos los roles autenticados)
router.get('/', reparacionController.getAllReparaciones);

// Obtener reparación por ID (todos los roles autenticados)
router.get('/id/:id', reparacionController.getReparacionById);

// Registrar diagnóstico (todos los roles autenticados, pero con validación adicional en el controlador)
router.put('/:id/diagnostico', reparacionController.registrarDiagnostico);

// Actualizar estado (Administrador y Jefe de taller)
router.put('/:id/estado', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    reparacionController.updateEstado
);

// Obtener reparaciones por auxiliar (todos los roles autenticados)
router.get('/auxiliar/:auxiliar_id', reparacionController.getReparacionesByAuxiliar);

// Obtener reparaciones por moto (todos los roles autenticados)
router.get('/moto/:moto_id', reparacionController.getReparacionesByMoto);

// Historial de reparaciones por cliente
router.get('/historial/cliente/:cliente_id', reparacionController.getHistorialByCliente);

// Historial de reparaciones por moto
router.get('/historial/moto/:moto_id', reparacionController.getHistorialByMoto);

// Reporte de motos atendidas por auxiliar
router.get('/reporte/auxiliar/:auxiliar_id', reparacionController.getReporteMotosPorAuxiliar);

// Actualizar mano de obra (todos los roles autenticados)
router.put('/:id/mano-obra', reparacionController.updateManoObra);

// Obtener total de reparación por ID
router.get('/:id/total', reparacionController.getTotalReparacion);

// Sumar mano de obra por auxiliar y rango de fechas (Jefe de taller y Administrador)
router.get('/reporte/mano-obra/suma', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    reparacionController.getSumaManoObraPorAuxiliar
);

// Obtener reparaciones detalladas por auxiliar y rango de fechas (Jefe de taller y Administrador)
router.get('/reporte/detalle/auxiliar/:auxiliar_id', 
    authorizeRoles(['Administrador', 'Jefe de taller']), 
    reparacionController.getReparacionesDetalladasPorAuxiliar
);

module.exports = router;