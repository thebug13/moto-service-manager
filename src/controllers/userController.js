const User = require('../models/user');

// Obtener todos los usuarios
const index = (req, res) => {
    User.findAll((err, users) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(users);
    });
};

// Actualizar el rol de un usuario
const updateRole = (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'El rol es requerido' });
    }

    User.updateRole(id, role, (err, affectedRows) => {
        if (err) {
            console.error('Error al actualizar el rol del usuario:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
    });
};

module.exports = {
    index,
    updateRole
}; 