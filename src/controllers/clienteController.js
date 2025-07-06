const Cliente = require('../models/cliente');
const Moto = require('../models/moto');

// Crear un nuevo cliente
const createCliente = async (req, res) => {
    try {
        let { nombre, telefono, placa, marca, modelo } = req.body;

        // Transformar a mayúsculas
        nombre = nombre ? nombre.toUpperCase() : '';
        telefono = telefono ? telefono.toUpperCase() : '';
        marca = marca ? marca.toUpperCase() : undefined;
        modelo = modelo ? modelo.toUpperCase() : undefined;
        if (placa) {
            placa = placa.replace(/\s+/g, '').toUpperCase();
            if (!placa.includes('-') && placa.length === 6) {
                placa = placa.slice(0,3) + '-' + placa.slice(3);
            }
        }

        // Validaciones básicas
        if (!nombre || !telefono) {
            return res.status(400).json({ message: 'Nombre y teléfono son requeridos' });
        }

        // Buscar cliente por nombre y teléfono
        let cliente = await Cliente.findAll();
        cliente = cliente.find(c => c.nombre === nombre && c.telefono === telefono);
        let clienteId;
        if (cliente) {
            clienteId = cliente.id;
            // Si el teléfono cambió, actualizarlo
            if (cliente.telefono !== telefono) {
                await Cliente.updateCliente(clienteId, nombre, telefono);
            }
        } else {
            // Crear cliente si no existe
            const nuevoCliente = await Cliente.createCliente(nombre, telefono);
            clienteId = nuevoCliente.id;
        }

        // Si hay datos de moto
        if (placa && marca && modelo) {
            // Buscar moto por placa
            let moto = await Moto.findByPlaca(placa);
            if (moto) {
                // Si la moto existe pero está asociada a otro cliente, actualizar la asociación
                if (moto.cliente_id !== clienteId) {
                    await Moto.updateMoto(moto.id, placa, marca, modelo, clienteId);
                } else {
                    // Si la moto ya está asociada, solo actualizar marca/modelo si cambiaron
                    if (moto.marca !== marca || moto.modelo !== modelo) {
                        await Moto.updateMoto(moto.id, placa, marca, modelo, clienteId);
                    }
                }
                return res.status(201).json({ cliente: { id: clienteId, nombre, telefono }, moto });
            } else {
                // Crear moto nueva asociada al cliente
                const nuevaMoto = await Moto.createMoto(placa, marca, modelo, clienteId);
                return res.status(201).json({ cliente: { id: clienteId, nombre, telefono }, moto: nuevaMoto });
            }
        } else {
            // Solo cliente
            return res.status(201).json({ id: clienteId, nombre, telefono });
        }
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
};

// Obtener todos los clientes
const getAllClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;

        // Validaciones básicas
        if (!nombre || !telefono) {
            return res.status(400).json({ message: 'Nombre y teléfono son requeridos' });
        }

        const success = await Cliente.updateCliente(id, nombre, telefono);

        if (!success) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Cliente.deleteCliente(id);

        if (!success) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        if (error.message === 'No se puede eliminar el cliente porque tiene motos registradas') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};

module.exports = {
    createCliente,
    getAllClientes,
    getClienteById,
    updateCliente,
    deleteCliente
};