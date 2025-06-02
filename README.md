# Aplicación CRUD en Node.js

Una aplicación CRUD (Crear, Leer, Actualizar, Eliminar) full-stack construida con Node.js, Express y el motor de plantillas EJS.

## Características

- Sistema de gestión de productos
- Gestión de categorías
- Formulario de contacto con funcionalidad de correo electrónico
- Integración con base de datos SQLite
- Diseño responsivo con layouts EJS

## Requisitos Previos

- Node.js (v14 o superior)
- npm (Node Package Manager)

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd crud-node
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en el directorio raíz y copiar el contenido de `.env-example`:
```bash
cp .env-example .env
```

4. Actualizar el archivo `.env` con tu configuración:
- Establecer el PUERTO deseado (predeterminado: 3001)
- Configurar los ajustes SMTP para la funcionalidad de correo electrónico
  Puedes crearte una cuenta gratuita en: [Mailtrap](https://mailtrap.io/email-sending/)
- Configurar los ajustes de la base de datos
  Puedes crear la base de datos Mysql en Xammp o Laragon totalmente gratis
## Estructura del Proyecto

```
crud-node/
├── src/
│   ├── views/         # Plantillas EJS
│   ├── routes/        # Manejadores de rutas
│   └── controllers/   # Lógica de negocio
├── public/           # Archivos estáticos
├── private/         # Recursos privados
├── index.js         # Punto de entrada de la aplicación
└── database.db      # Base de datos SQLite
```

## Scripts Disponibles

- `npm start`: Iniciar la aplicación
- `npm run dev`: Iniciar la aplicación con nodemon para desarrollo

## Dependencias

- express: Framework web
- ejs: Motor de plantillas
- express-ejs-layouts: Soporte de layouts para EJS
- method-override: Sobrescritura de métodos HTTP
- mysql2: Cliente MySQL
- nodemailer: Funcionalidad de correo electrónico
- sqlite3: Base de datos SQLite
- dotenv: Variables de entorno
- nodemon: Servidor de desarrollo (dependencia de desarrollo)

## Rutas

- `/`: Página principal
- `/categorias`: Gestión de categorías
- `/productos`: Gestión de productos
- `/contacto`: Formulario de contacto

## Base de Datos

La aplicación utiliza SQLite como sistema de base de datos. El archivo de la base de datos se encuentra en `database.db` en el directorio raíz.

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
