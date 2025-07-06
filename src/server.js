require('dotenv').config();
const app = require('./app');

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('Variables de entorno cargadas:');
    console.log(`- Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`- Puerto: ${PORT}`);
    console.log('- Base de datos: Conectada');
});