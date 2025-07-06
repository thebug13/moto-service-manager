const User = require('../models/user');

// Obtener todos los usuarios
const index = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar el rol de un usuario
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'El rol es requerido' });
    }

    try {
        const affectedRows = await User.updateRole(id, role);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el rol del usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear un usuario
const create = async (req, res) => {
    const { email, password, role, nombre_auxiliar } = req.body;
    if (!email || !password || !role || !nombre_auxiliar) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    try {
        const user = await User.createUser(email, password, role, nombre_auxiliar);
        res.status(201).json(user);
    } catch (err) {
        if (err.message === 'El email ya está registrado') {
            return res.status(409).json({ message: err.message });
        }
        console.error('Error al crear usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Editar un usuario
const update = async (req, res) => {
    const { id } = req.params;
    const { email, password, role, nombre_auxiliar } = req.body;
    if (!email || !role || !nombre_auxiliar) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    try {
        const updated = await User.updateUser(id, email, password, role, nombre_auxiliar);
        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar un usuario
const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    index,
    updateRole,
    create,
    update,
    remove
}; 