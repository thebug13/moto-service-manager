const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const motoRoutes = require('./routes/motoRoutes');
const reparacionRoutes = require('./routes/reparacionRoutes');
const repuestoRoutes = require('./routes/repuestoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const productosRoutes = require('./routes/productos.router');
const categoriasRoutes = require('./routes/categorias.router');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/motos', motoRoutes);
app.use('/api/reparaciones', reparacionRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'API del Sistema de Taller Mecánico funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;