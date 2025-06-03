const model = require("../models/Category");

// No necesitamos el método create si solo respondemos con JSON
// const create = (req, res) => {
//   res.render("categorias/create");
// };

const store = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  try {
    const id = await model.create(nombre); // Usar await
    res.status(201).json({ id, nombre });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return res.status(500).json({ error: 'Error al crear categoría' });
  }
};

const index = async (req, res) => {
  try {
    const categorias = await model.findAll(); // Usar await
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

const show = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await model.findById(id); // Usar await
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// No necesitamos el método edit si solo respondemos con JSON
// const edit = (req, res) => {
//   const { id } = req.params;
//   model.findById(id, (error, categoria) => {
//     if (error) {
//       return res.status(500).send("Internal Server Error");
//     }
//     if (!categoria) {
//       return res.status(404).send("No existe la categoría");
//     }
//     res.render("categorias/edit", { categoria });
//   });
// };

const update = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  try {
    const changes = await model.update(id, nombre); // Usar await
    if (changes === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ id, nombre });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const changes = await model.destroy(id); // Usar await
     if (changes === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  // create,
  store,
  index,
  show,
  // edit,
  update,
  destroy,
};