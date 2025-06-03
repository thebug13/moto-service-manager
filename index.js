require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./src/models/mysql"); // Importar la conexión a MySQL

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:4200', // URL de Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const layouts = require("express-ejs-layouts");

const path = require("path");

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(layouts);
app.set("layout", "layouts/layout");

// Configuración de rutas API - Usamos el pool 'db' directamente en los modelos
const mainRouter = require("./src/routes/main.router");
app.use('/api', mainRouter);

app.use("/api/categorias", require("./src/routes/categorias.router"));
app.use("/api/productos", require("./src/routes/productos.router"));
app.use("/api/contacto", require("./src/routes/contacto.router"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`API Server running at http://localhost:${PORT}`));