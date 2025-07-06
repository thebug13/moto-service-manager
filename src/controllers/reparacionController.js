const Reparacion = require('../models/reparacion');
const Moto = require('../models/moto');
const User = require('../models/user');
const Repuesto = require('../models/repuesto');

// Registrar ingreso de moto al taller
const createReparacion = async (req, res) => {
    try {
        const { moto_id, auxiliar_id, mano_obra } = req.body;
        console.log('Datos recibidos para crear reparación:', req.body);

        // Validaciones básicas
        if (!moto_id || !auxiliar_id) {
            return res.status(400).json({ 
                message: 'ID de moto y ID de auxiliar son requeridos' 
            });
        }
        if (mano_obra === undefined || isNaN(mano_obra) || mano_obra < 0) {
            return res.status(400).json({ message: 'El costo de mano de obra es requerido y debe ser un número positivo' });
        }

        // Verificar que la moto existe
        const moto = await Moto.findById(moto_id);
        if (!moto) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        // Verificar que el auxiliar existe y tiene el rol correcto
        const auxiliar = await User.findById(auxiliar_id);
        if (!auxiliar || auxiliar.role !== 'Auxiliar') {
            return res.status(404).json({ message: 'Auxiliar no encontrado o rol inválido' });
        }

        const reparacion = await Reparacion.createReparacion(moto_id, auxiliar_id, mano_obra);
        res.status(201).json(reparacion);
    } catch (error) {
        console.error('Error al crear reparación:', error);
        res.status(500).json({ message: 'Error al crear la reparación' });
    }
};

// Obtener todas las reparaciones
const getAllReparaciones = async (req, res) => {
    try {
        const reparaciones = await Reparacion.findAll();
        res.json(reparaciones);
    } catch (error) {
        console.error('Error al obtener reparaciones:', error);
        res.status(500).json({ message: 'Error al obtener las reparaciones' });
    }
};

// Obtener una reparación por ID
const getReparacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const reparacion = await Reparacion.findById(id);

        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        res.json(reparacion);
    } catch (error) {
        console.error('Error al obtener reparación:', error);
        res.status(500).json({ message: 'Error al obtener la reparación' });
    }
};

// Registrar diagnóstico
const registrarDiagnostico = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnostico } = req.body;

        if (!diagnostico) {
            return res.status(400).json({ message: 'El diagnóstico es requerido' });
        }

        // Verificar que la reparación existe
        const reparacion = await Reparacion.findById(id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        // Verificar que el usuario es el auxiliar asignado o tiene rol superior
        if (req.user.role === 'Auxiliar' && req.user.id !== reparacion.auxiliar_id) {
            return res.status(403).json({ 
                message: 'No tienes permiso para modificar esta reparación' 
            });
        }

        // Permitir éxito aunque no se modifique ninguna fila (por ejemplo, si el diagnóstico es igual)
        await Reparacion.updateDiagnostico(id, diagnostico);
        res.json({ message: 'Diagnóstico registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar diagnóstico:', error);
        res.status(500).json({ message: 'Error al registrar el diagnóstico', error: error.message });
    }
};

// Actualizar estado de reparación
const updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ message: 'El estado es requerido' });
        }

        // Verificar estados válidos
        const estadosValidos = ['ingresada', 'asignada', 'diagnosticada', 'reparada', 'facturada', 'entregada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const success = await Reparacion.updateEstado(id, estado);
        if (!success) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        res.json({ message: 'Estado actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado' });
    }
};

// Obtener reparaciones por auxiliar
const getReparacionesByAuxiliar = async (req, res) => {
    try {
        const { auxiliar_id } = req.params;
        console.log('Llamada a getReparacionesByAuxiliar con auxiliar_id:', auxiliar_id);
        console.log('Usuario autenticado:', req.user);
        // Verificar que el auxiliar existe
        const auxiliar = await User.findById(auxiliar_id);
        console.log('Resultado de User.findById:', auxiliar);
        if (!auxiliar || auxiliar.role !== 'Auxiliar') {
            console.log('Auxiliar no encontrado o rol inválido');
            return res.status(404).json({ message: 'Auxiliar no encontrado o rol inválido' });
        }
        const reparaciones = await Reparacion.findByAuxiliarId(auxiliar_id);
        console.log('Reparaciones encontradas:', reparaciones);
        res.json(reparaciones);
    } catch (error) {
        console.error('Error al obtener reparaciones del auxiliar:', error);
        res.status(500).json({ message: 'Error al obtener las reparaciones del auxiliar' });
    }
};

// Obtener reparaciones por moto
const getReparacionesByMoto = async (req, res) => {
    try {
        const { moto_id } = req.params;

        // Verificar que la moto existe
        const moto = await Moto.findById(moto_id);
        if (!moto) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        const reparaciones = await Reparacion.findByMotoId(moto_id);
        res.json(reparaciones);
    } catch (error) {
        console.error('Error al obtener reparaciones de la moto:', error);
        res.status(500).json({ message: 'Error al obtener las reparaciones de la moto' });
    }
};

// Obtener historial de reparaciones por cliente
const getHistorialByCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        const historial = await Reparacion.findHistorialByCliente(cliente_id);
        res.json(historial);
    } catch (error) {
        console.error('Error al obtener historial por cliente:', error);
        res.status(500).json({ message: 'Error al obtener el historial por cliente' });
    }
};

// Obtener historial de reparaciones por moto
const getHistorialByMoto = async (req, res) => {
    try {
        const { moto_id } = req.params;
        const historial = await Reparacion.findHistorialByMoto(moto_id);
        res.json(historial);
    } catch (error) {
        console.error('Error al obtener historial por moto:', error);
        res.status(500).json({ message: 'Error al obtener el historial por moto' });
    }
};

// Reporte de motos atendidas por auxiliar
const getReporteMotosPorAuxiliar = async (req, res) => {
    try {
        const { auxiliar_id } = req.params;
        const reporte = await Reparacion.reporteMotosPorAuxiliar(auxiliar_id);
        res.json(reporte);
    } catch (error) {
        console.error('Error al obtener reporte de motos por auxiliar:', error);
        res.status(500).json({ message: 'Error al obtener el reporte de motos por auxiliar' });
    }
};

// Actualizar solo el campo mano_obra
const updateManoObra = async (req, res) => {
    try {
        const { id } = req.params;
        const { mano_obra } = req.body;
        if (mano_obra === undefined || isNaN(mano_obra) || mano_obra < 0) {
            return res.status(400).json({ message: 'El costo de mano de obra es requerido y debe ser un número positivo' });
        }
        const success = await Reparacion.updateManoObra(id, mano_obra);
        if (!success) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }
        res.json({ message: 'Mano de obra actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar mano de obra:', error);
        res.status(500).json({ message: 'Error al actualizar mano de obra' });
    }
};

// Obtener el total de una reparación (repuestos + mano de obra)
const getTotalReparacion = async (req, res) => {
    try {
        const { id } = req.params;
        const reparacion = await Reparacion.findById(id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }
        const totalRepuestos = await Repuesto.calcularTotalRepuestos(id);
        const manoObra = reparacion.mano_obra || 0;
        const total = parseFloat(totalRepuestos) + parseFloat(manoObra);
        res.json({ total, totalRepuestos: parseFloat(totalRepuestos), manoObra: parseFloat(manoObra) });
    } catch (error) {
        console.error('Error al calcular el total de la reparación:', error);
        res.status(500).json({ message: 'Error al calcular el total de la reparación' });
    }
};

// Sumar mano de obra por auxiliar y rango de fechas
const getSumaManoObraPorAuxiliar = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        if (!desde || !hasta) {
            return res.status(400).json({ message: 'Debe proporcionar las fechas desde y hasta' });
        }
        const resultado = await Reparacion.sumManoObraPorAuxiliar(desde, hasta);
        res.json(resultado);
    } catch (error) {
        console.error('Error al sumar mano de obra por auxiliar:', error);
        res.status(500).json({ message: 'Error al sumar mano de obra por auxiliar' });
    }
};

// Obtener reparaciones detalladas por auxiliar y rango de fechas
const getReparacionesDetalladasPorAuxiliar = async (req, res) => {
    try {
        const { auxiliar_id } = req.params;
        const { desde, hasta } = req.query;
        
        console.log('Solicitando detalles para auxiliar:', auxiliar_id, 'desde:', desde, 'hasta:', hasta);
        
        if (!desde || !hasta) {
            return res.status(400).json({ message: 'Debe proporcionar las fechas desde y hasta' });
        }
        
        const reparaciones = await Reparacion.getReparacionesDetalladasPorAuxiliar(auxiliar_id, desde, hasta);
        console.log('Reparaciones detalladas encontradas:', reparaciones);
        console.log('Total de mano de obra en backend:', reparaciones.reduce((total, r) => total + (Number(r.mano_obra) || 0), 0));
        
        res.json(reparaciones);
    } catch (error) {
        console.error('Error al obtener reparaciones detalladas por auxiliar:', error);
        res.status(500).json({ message: 'Error al obtener reparaciones detalladas por auxiliar' });
    }
};

module.exports = {
    createReparacion,
    getAllReparaciones,
    getReparacionById,
    registrarDiagnostico,
    updateEstado,
    getReparacionesByAuxiliar,
    getReparacionesByMoto,
    getHistorialByCliente,
    getHistorialByMoto,
    getReporteMotosPorAuxiliar,
    updateManoObra,
    getTotalReparacion,
    getSumaManoObraPorAuxiliar,
    getReparacionesDetalladasPorAuxiliar
};