# Aplicación CRUD Full-Stack

Una aplicación CRUD (Crear, Leer, Actualizar, Eliminar) full-stack con backend en **Node.js/Express** y frontend en **Angular 19**. Utiliza **MySQL** para la gestión de productos, categorías y usuarios, e incluye un sistema de autenticación robusto con roles.

## Características

- **Backend robusto** con Node.js y Express, sirviendo una API RESTful.
- **Frontend moderno** con Angular 19 para una interfaz de usuario dinámica y responsiva.
- **Autenticación de usuarios** con JWT (JSON Web Tokens).
- **Control de acceso basado en roles**: `Administrador` y `Vendedor`.
    - `Administrador` tiene acceso total (Crear, Leer, Actualizar, Eliminar) en todas las entidades.
    - `Vendedor` puede Crear, Leer y Actualizar productos y categorías, pero no puede eliminar.
- Gestión completa de **productos** (CRUD).
- Gestión completa de **categorías** (CRUD).
- **Gestión de usuarios** (CRUD para `Administradores`).
- Navegación con **barra superior (NavbarComponent)** y **pie de página (FooterComponent)** reutilizables.
- **Sesión con timeout**: Cierra la sesión automáticamente después de un período de inactividad.
- Estilización con fuente **"Permanent Marker"** en títulos clave (`Gestión de Productos`, `Gestión de Categorías`, `Gestión de Usuarios`).
- Integración con base de datos **MySQL** para persistencia de datos.

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

MYSQL_HOST=localhost
MYSQL_USER=tu_usuario_mysql
MYSQL_PASSWORD=tu_password_mysql
MYSQL_DATABASE=crud_node
JWT_SECRET=tu_secreto_jwt_seguro
```

5. Crear la base de datos y las tablas en tu servidor MySQL. Ejecuta el script de inicialización del backend:
```bash
node src/models/init-db.js
```
Este script creará la base de datos `crud_node` (si no existe) y las tablas `users`, `categorias` y `productos`, incluyendo un usuario `Administrador` por defecto.

## Estructura del Proyecto

```
crud-node/
├── src/             # Código del Backend
│   ├── controllers/   # Lógica de negocio (authController.js, productos.controller.js, etc.)
│   ├── models/        # Modelos de datos e interacción con DB (user.js, product.js, category.js, init-db.js)
│   ├── middleware/    # Middleware de autenticación y autorización (authMiddleware.js)
│   └── routes/        # Manejadores de rutas API (index.js)
├── frontend/        # Código del Frontend de Angular
│   ├── src/           # Archivos fuente de Angular
│   │   ├── app/         # Componentes, servicios, módulos de Angular
│   │   │   ├── components/  # Componentes reutilizables (navbar, footer, layout)
│   │   │   ├── services/    # Servicios (auth.service.ts, api.service.ts)
│   │   │   ├── guards/      # Guardias de ruta (auth.guard.ts)
│   │   │   └── ...
│   │   ├── assets/      # Archivos estáticos
│   │   ├── environments/ # Variables de entorno
│   │   ├── index.html   # HTML principal
│   │   └── styles.scss  # Estilos globales
│   └── ...
├── index.js         # Punto de entrada del Backend
├── package.json     # Dependencias del Backend
└── .env             # Variables de entorno
```

## Scripts Disponibles

- Para iniciar el **backend**:
```bash
npm run dev
```
El Backend se inicia en: `http://localhost:3001`

- Para iniciar el **frontend** (en una terminal separada):
```bash
cd frontend
ng serve
```
El Frontend se inicia en: `http://localhost:4200`

## Rutas API (Backend)

Interactúa con estas rutas desde el frontend de Angular:

- **Autenticación y Usuarios:**
    - `POST /api/auth/signup`: Registro de nuevos usuarios.
    - `POST /api/auth/login`: Inicio de sesión de usuarios.
    - `GET /api/users`: Listar usuarios (requiere token, solo `Administrador`).
    - `PUT /api/users/:id`: Actualizar usuario (requiere token, solo `Administrador`).
    - `DELETE /api/users/:id`: Eliminar usuario (requiere token, solo `Administrador`).

- **Categorías:**
    - `GET /api/categorias`: Listar categorías (requiere token).
    - `POST /api/categorias`: Crear nueva categoría (requiere token, `Administrador` o `Vendedor`).
    - `GET /api/categorias/:id`: Obtener categoría por ID (requiere token).
    - `PUT /api/categorias/:id`: Actualizar categoría por ID (requiere token, `Administrador` o `Vendedor`).
    - `DELETE /api/categorias/:id`: Eliminar categoría por ID (requiere token, solo `Administrador`).

- **Productos:**
    - `GET /api/productos`: Listar productos (requiere token).
    - `POST /api/productos`: Crear nuevo producto (requiere token, `Administrador` o `Vendedor`).
    - `GET /api/productos/:id`: Obtener producto por ID (requiere token).
    - `PUT /api/productos/:id`: Actualizar producto por ID (requiere token, `Administrador` o `Vendedor`).
    - `DELETE /api/productos/:id`: Eliminar producto por ID (requiere token, solo `Administrador`).

## Base de Datos

La aplicación utiliza **MySQL** para almacenar información de usuarios, categorías y productos. La configuración de conexión se realiza a través del archivo `.env`. Las tablas utilizadas son:

- **`users`**:
    - `id` (INT, PK, AI)
    - `username` (VARCHAR, UNIQUE)
    - `password` (VARCHAR)
    - `role` (VARCHAR, ej. 'Administrador', 'Vendedor', por defecto 'Vendedor')

- **`categorias`**:
    - `id` (INT, PK, AI)
    - `nombre` (VARCHAR)

- **`productos`**:
    - `id` (INT, PK, AI)
    - `nombre` (VARCHAR)
    - `precio` (DECIMAL)
    - `categoria_id` (INT, FK a `categorias`)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Autor

Felipe Loaiza Castaño
- GitHub: [@thebug13](https://github.com/thebug13)
