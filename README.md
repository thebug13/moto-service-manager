# Aplicación CRUD Full-Stack

Una aplicación CRUD (Crear, Leer, Actualizar, Eliminar) full-stack con backend en **Node.js/Express** y frontend en **Angular 19**. Utiliza **MySQL** para la gestión de productos y categorías, y mantiene funcionalidad de formulario de contacto con envío de correo.

## Características

- **Backend robusto** con Node.js y Express, sirviendo una API RESTful.
- **Frontend moderno** con Angular 19 para una interfaz de usuario dinámica.
- Gestión completa de **productos** (CRUD) a través de la API.
- Gestión completa de **categorías** (CRUD) a través de la API.
- Formulario de **contacto** con funcionalidad de envío de correo electrónico (vía SMTP).
- Integración con base de datos **MySQL** para persistencia de datos.
- Diseño responsivo.

## Requisitos Previos

- Node.js (v14 o superior)
- npm (Node Package Manager)
- Angular CLI (Instalar globalmente: `npm install -g @angular/cli`)
- Servidor MySQL en ejecución

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd crud-node
```

2. Instalar dependencias del **backend**:
```bash
npm install
```

3. Instalar dependencias del **frontend**:
```bash
cd frontend
npm install
cd ..
```

4. Crear un archivo `.env` en el directorio raíz (`crud-node/`) copiando el contenido de `.env-example` y actualizándolo con tu configuración. Ejemplo:
```env
PORT=3001

SMTP_HOST=tu_smtp_host
SMTP_PORT=tu_smtp_port
SMTP_USER=tu_smtp_user
SMTP_PASS=tu_smtp_pass

MYSQL_HOST=localhost
MYSQL_USER=tu_usuario_mysql
MYSQL_PASSWORD=tu_password_mysql
MYSQL_DATABASE=crud_node
```

5. Crear la base de datos y las tablas en tu servidor MySQL. Puedes usar un cliente MySQL o ejecutar el script de inicialización del backend:
```bash
node src/models/init-db.js
```
   Este script creará la base de datos `crud_node` (si no existe) y las tablas `categorias` y `productos`.

## Estructura del Proyecto

```
crud-node/
├── src/             # Código del Backend
│   ├── controllers/   # Lógica de negocio del Backend
│   ├── models/        # Modelos de datos e interacción con DB
│   ├── routes/        # Manejadores de rutas API
│   └── views/         # Plantillas EJS (funcionalidad de contacto si se usa)
├── frontend/        # Código del Frontend de Angular
│   ├── src/           # Archivos fuente de Angular
│   └── ...
├── public/           # Archivos estáticos del Backend
├── index.js         # Punto de entrada del Backend
├── package.json     # Dependencias del Backend
└── .env             # Variables de entorno
```

## Scripts Disponibles

- Para iniciar el **backend**:

npm run dev


El Backend se inicia en la siguiente direccion: http://localhost:3001

- Para iniciar el **frontend** (en una terminal separada):

- cd frontend
- ng serve

El Frontend se inicia en la siguiente direccion: http://localhost:4200

## Rutas API (Backend)

Interactúa con estas rutas desde el frontend de Angular:

- `GET /api/categorias`: Listar categorías
- `POST /api/categorias`: Crear nueva categoría
- `GET /api/categorias/:id`: Obtener categoría por ID
- `PUT /api/categorias/:id`: Actualizar categoría por ID
- `DELETE /api/categorias/:id`: Eliminar categoría por ID
- `GET /api/productos`: Listar productos
- `POST /api/productos`: Crear nuevo producto
- `GET /api/productos/:id`: Obtener producto por ID
- `PUT /api/productos/:id`: Actualizar producto por ID
- `DELETE /api/productos/:id`: Eliminar producto por ID
- `POST /api/contacto`: Enviar mensaje de contacto

## Base de Datos

La aplicación utiliza **MySQL** para almacenar información de categorías y productos. La configuración de conexión se realiza a través del archivo `.env`. Las tablas utilizadas son:

- **`categorias`**: `id` (INT, PK, AI), `nombre` (VARCHAR)
- **`productos`**: `id` (INT, PK, AI), `nombre` (VARCHAR), `precio` (DECIMAL), `categoria_id` (INT, FK a `categorias`)

## Contribuir

1. Haz un Fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Agregar alguna característica increíble'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Autor

Felipe Loaiza Castaño
- GitHub: [@thebug13](https://github.com/thebug13)
