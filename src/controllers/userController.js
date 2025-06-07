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

module.exports = {
    index,
    updateRole
}; 