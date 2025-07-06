const Factura = require('../models/factura');
const Reparacion = require('../models/reparacion');
const Cliente = require('../models/cliente');

// Generar una nueva factura
const createFactura = async (req, res) => {
    try {
        const { reparacion_id } = req.params;
        const { mano_obra } = req.body;

        // Validaciones básicas
        if (!mano_obra || mano_obra <= 0) {
            return res.status(400).json({ 
                message: 'El costo de mano de obra es requerido y debe ser mayor a 0' 
            });
        }

        // Verificar que la reparación existe y está en estado correcto
        const reparacion = await Reparacion.findById(reparacion_id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada' });
        }

        if (reparacion.estado !== 'reparada') {
            return res.status(400).json({ 
                message: 'La reparación debe estar en estado "reparada" para generar la factura' 
            });
        }

        // Verificar que no exista una factura previa
        const facturas = await Factura.findAll();
        const facturaExistente = facturas.find(f => f.reparacion_id === parseInt(reparacion_id));
        if (facturaExistente) {
            return res.status(400).json({ message: 'Ya existe una factura para esta reparación' });
        }

        const factura = await Factura.createFactura(reparacion_id, mano_obra);
        res.status(201).json(factura);
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json({ message: 'Error al crear la factura' });
    }
};

// Obtener una factura por ID
const getFacturaById = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await Factura.findById(id);

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        res.json(factura);
    } catch (error) {
        console.error('Error al obtener factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura' });
    }
};

// Marcar factura como pagada
const marcarComoPagada = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que la factura existe
        const factura = await Factura.findById(id);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        if (factura.estado === 'pagada') {
            return res.status(400).json({ message: 'La factura ya está marcada como pagada' });
        }

        const success = await Factura.marcarComoPagada(id);
        if (!success) {
            return res.status(500).json({ message: 'Error al marcar la factura como pagada' });
        }

        res.json({ message: 'Factura marcada como pagada exitosamente' });
    } catch (error) {
        console.error('Error al marcar factura como pagada:', error);
        res.status(500).json({ message: 'Error al marcar la factura como pagada' });
    }
};

// Obtener todas las facturas
const getAllFacturas = async (req, res) => {
    try {
        const facturas = await Factura.findAll();
        res.json(facturas);
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas' });
    }
};

// Obtener facturas por cliente
const getFacturasByCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;

        // Verificar que el cliente existe
        const cliente = await Cliente.findById(cliente_id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const facturas = await Factura.findByClienteId(cliente_id);
        res.json(facturas);
    } catch (error) {
        console.error('Error al obtener facturas del cliente:', error);
        res.status(500).json({ message: 'Error al obtener las facturas del cliente' });
    }
};

module.exports = {
    createFactura,
    getFacturaById,
    marcarComoPagada,
    getAllFacturas,
    getFacturasByCliente
};