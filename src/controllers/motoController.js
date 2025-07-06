const Moto = require('../models/moto');
const Cliente = require('../models/cliente');

// Crear una nueva moto
const createMoto = async (req, res) => {
    try {
        const { placa, marca, modelo, cliente_id } = req.body;

        // Validaciones básicas
        if (!placa || !marca || !modelo || !cliente_id) {
            return res.status(400).json({ 
                message: 'Placa, marca, modelo y cliente_id son requeridos' 
            });
        }

        // Verificar que el cliente existe
        const cliente = await Cliente.findById(cliente_id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const moto = await Moto.createMoto(placa, marca, modelo, cliente_id);
        res.status(201).json(moto);
    } catch (error) {
        if (error.message === 'La placa ya está registrada') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error al crear moto:', error);
        res.status(500).json({ message: 'Error al crear la moto' });
    }
};

// Obtener todas las motos
const getAllMotos = async (req, res) => {
    try {
        const motos = await Moto.findAll();
        res.json(motos);
    } catch (error) {
        console.error('Error al obtener motos:', error);
        res.status(500).json({ message: 'Error al obtener las motos' });
    }
};

// Obtener una moto por ID
const getMotoById = async (req, res) => {
    try {
        const { id } = req.params;
        const moto = await Moto.findById(id);

        if (!moto) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        res.json(moto);
    } catch (error) {
        console.error('Error al obtener moto:', error);
        res.status(500).json({ message: 'Error al obtener la moto' });
    }
};

// Obtener una moto por placa
const getMotoByPlaca = async (req, res) => {
    try {
        const { placa } = req.params;
        const moto = await Moto.findByPlaca(placa);

        if (!moto) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        res.json(moto);
    } catch (error) {
        console.error('Error al obtener moto:', error);
        res.status(500).json({ message: 'Error al obtener la moto' });
    }
};

// Actualizar una moto
const updateMoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, marca, modelo, cliente_id } = req.body;

        // Validaciones básicas
        if (!placa || !marca || !modelo || !cliente_id) {
            return res.status(400).json({ 
                message: 'Placa, marca, modelo y cliente_id son requeridos' 
            });
        }

        // Verificar que el cliente existe
        const cliente = await Cliente.findById(cliente_id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const success = await Moto.updateMoto(id, placa, marca, modelo, cliente_id);

        if (!success) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        res.json({ message: 'Moto actualizada exitosamente' });
    } catch (error) {
        if (error.message === 'La placa ya está registrada') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error al actualizar moto:', error);
        res.status(500).json({ message: 'Error al actualizar la moto' });
    }
};

// Eliminar una moto
const deleteMoto = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Moto.deleteMoto(id);

        if (!success) {
            return res.status(404).json({ message: 'Moto no encontrada' });
        }

        res.json({ message: 'Moto eliminada exitosamente' });
    } catch (error) {
        if (error.message === 'No se puede eliminar la moto porque tiene reparaciones registradas') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error al eliminar moto:', error);
        res.status(500).json({ message: 'Error al eliminar la moto' });
    }
};

// Obtener motos por cliente
const getMotosByCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        
        // Verificar que el cliente existe
        const cliente = await Cliente.findById(cliente_id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const motos = await Moto.findByClienteId(cliente_id);
        res.json(motos);
    } catch (error) {
        console.error('Error al obtener motos del cliente:', error);
        res.status(500).json({ message: 'Error al obtener las motos del cliente' });
    }
};

module.exports = {
    createMoto,
    getAllMotos,
    getMotoById,
    getMotoByPlaca,
    updateMoto,
    deleteMoto,
    getMotosByCliente
};