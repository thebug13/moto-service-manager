const Repuesto = require('../models/repuesto');
const Reparacion = require('../models/reparacion');

// Agregar un repuesto a una reparación
const createRepuesto = async (req, res) => {
    try {
        const { reparacion_id } = req.params;
        const { nombre, precio, cantidad } = req.body;

        // Validaciones básicas
        if (!nombre || !precio) {
            return res.status(400).json({ 
                message: 'Nombre y precio son requeridos' 
            });
        }

        // Verificar que la reparación existe
        const reparacion = await Reparacion.findById(reparacion_id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        // Verificar que el usuario es el auxiliar asignado o tiene rol superior
        if (req.user.role === 'Auxiliar' && req.user.id !== reparacion.auxiliar_id) {
            return res.status(403).json({ 
                message: 'No tienes permiso para modificar esta reparación' 
            });
        }

        const repuesto = await Repuesto.createRepuesto(
            reparacion_id, 
            nombre, 
            precio, 
            cantidad || 1
        );

        res.status(201).json(repuesto);
    } catch (error) {
        console.error('Error al crear repuesto:', error);
        res.status(500).json({ message: 'Error al crear el repuesto' });
    }
};

// Obtener repuestos de una reparación
const getRepuestosByReparacion = async (req, res) => {
    try {
        const { reparacion_id } = req.params;

        // Verificar que la reparación existe
        const reparacion = await Reparacion.findById(reparacion_id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        const repuestos = await Repuesto.findByReparacionId(reparacion_id);
        res.json(repuestos);
    } catch (error) {
        console.error('Error al obtener repuestos:', error);
        res.status(500).json({ message: 'Error al obtener los repuestos' });
    }
};

// Calcular total de repuestos
const calcularTotal = async (req, res) => {
    try {
        const { reparacion_id } = req.params;

        // Verificar que la reparación existe
        const reparacion = await Reparacion.findById(reparacion_id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        const total = await Repuesto.calcularTotalRepuestos(reparacion_id);
        res.json({ total });
    } catch (error) {
        console.error('Error al calcular total:', error);
        res.status(500).json({ message: 'Error al calcular el total' });
    }
};

// Actualizar un repuesto
const updateRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, cantidad } = req.body;

        // Validaciones básicas
        if (!nombre || !precio || !cantidad) {
            return res.status(400).json({ 
                message: 'Nombre, precio y cantidad son requeridos' 
            });
        }

        // Obtener el repuesto para verificar la reparación
        const repuesto = await Repuesto.findById(id);
        if (!repuesto) {
            return res.status(404).json({ message: 'Repuesto no encontrado' });
        }

        // Verificar permisos a través de la reparación
        const reparacion = await Reparacion.findById(repuesto.reparacion_id);
        if (req.user.role === 'Auxiliar' && req.user.id !== reparacion.auxiliar_id) {
            return res.status(403).json({ 
                message: 'No tienes permiso para modificar este repuesto' 
            });
        }

        const success = await Repuesto.updateRepuesto(id, nombre, precio, cantidad);
        if (!success) {
            return res.status(404).json({ message: 'Error al actualizar el repuesto' });
        }

        res.json({ message: 'Repuesto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar repuesto:', error);
        res.status(500).json({ message: 'Error al actualizar el repuesto' });
    }
};

// Eliminar un repuesto
const deleteRepuesto = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el repuesto para verificar la reparación
        const repuesto = await Repuesto.findById(id);
        if (!repuesto) {
            // Si el repuesto ya no existe, consideramos la operación exitosa (idempotente)
            return res.json({ message: 'Repuesto eliminado exitosamente (ya no existía)' });
        }

        // Verificar permisos a través de la reparación
        const reparacion = await Reparacion.findById(repuesto.reparacion_id);
        if (req.user.role === 'Auxiliar' && req.user.id !== reparacion.auxiliar_id) {
            return res.status(403).json({ 
                message: 'No tienes permiso para eliminar este repuesto' 
            });
        }

        const success = await Repuesto.deleteRepuesto(id);
        // Si success es false, igual respondemos como éxito (idempotente)
        return res.json({ message: 'Repuesto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar repuesto:', error);
        res.status(500).json({ message: 'Error al eliminar el repuesto' });
    }
};

module.exports = {
    createRepuesto,
    getRepuestosByReparacion,
    calcularTotal,
    updateRepuesto,
    deleteRepuesto
};