const querystring = require("querystring");
const model = require("../models/Product");

// No necesitamos el método create si solo respondemos con JSON
// const create = (req, res) => {
//   res.render("productos/create");
// };

const store = async (req, res) => {
  const { nombre, precio, categoria_id } = req.body; // Obtener todos los campos

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  try {
    // Pasar todos los campos al modelo
    const result = await model.store(nombre, precio, categoria_id);
    // Responder con el producto creado
    res.status(201).json({ id: result.insertId, nombre, precio, categoria_id });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ error: 'Error al crear producto' });
  }
};

const index = async (req, res) => {
  try {
    const productos = await model.findAll();
    res.json(productos); // Responder con JSON
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const show = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await model.findById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' }); // Responder con JSON
    }
    res.json(producto); // Responder con JSON
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// No necesitamos el método edit si solo respondemos con JSON
// const edit = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const producto = await model.findById(id);
//     if (!producto) {
//       return res.status(404).send("Producto no encontrado");
//     }
//     res.render("productos/edit", { producto });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

const update = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id } = req.body; // Obtener todos los campos

   if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  try {
    // Pasar todos los campos al modelo
    const result = await model.update(id, nombre, precio, categoria_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
     res.json({ id, nombre, precio, categoria_id }); // Responder con JSON
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await model.destroy(id);
     if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' }); // Responder con JSON
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ error: 'Error al eliminar producto' });
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