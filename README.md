# Sistema de Gestión de Taller Mecánico

Este sistema permite gestionar las operaciones diarias de un taller mecánico de motocicletas, incluyendo el registro de clientes, motos, reparaciones, repuestos y facturación.

## Características Principales

### 📋 Módulo de Clientes y Motos
- Registro y gestión de clientes
- Registro y seguimiento de motocicletas
- Vinculación de motos con sus propietarios

### 🧑‍🔧 Módulo de Recepción y Asignación
- Registro de ingreso de motocicletas
- Asignación de trabajos a auxiliares

### 🧰 Módulo de Diagnóstico y Repuestos
- Registro de diagnósticos
- Gestión de repuestos necesarios
- Cálculo de costos de reparación

### 🧾 Módulo de Facturación
- Generación de facturas
- Cálculo automático de costos
- Seguimiento de pagos

### 📁 Módulo de Historial
- Historial de reparaciones por moto/cliente
- Reportes de trabajo por auxiliar

## Roles del Sistema

- **Administrador**: Acceso total al sistema
- **Jefe de taller**: Supervisión de operaciones
- **Auxiliar**: Gestión de diagnósticos y reparaciones asignadas

## Requisitos Técnicos

- Node.js
- MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd taller-mecanico
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` con:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=crud_node
JWT_SECRET=tu_secreto_jwt
```

4. Configurar la base de datos:
```bash
npm run setup-db
```

5. Iniciar el servidor:
```bash
npm run dev
```

## Estructura de la API

### Autenticación
- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/signup` - Registrar usuario

### Clientes
- GET `/api/clientes` - Listar clientes
- POST `/api/clientes` - Crear cliente
- GET `/api/clientes/:id` - Obtener cliente
- PUT `/api/clientes/:id` - Actualizar cliente
- DELETE `/api/clientes/:id` - Eliminar cliente

### Motos
- GET `/api/motos` - Listar motos
- POST `/api/motos` - Registrar moto
- GET `/api/motos/id/:id` - Obtener moto por ID
- GET `/api/motos/placa/:placa` - Buscar moto por placa
- PUT `/api/motos/:id` - Actualizar moto
- DELETE `/api/motos/:id` - Eliminar moto

### Reparaciones
- POST `/api/reparaciones` - Crear reparación
- GET `/api/reparaciones` - Listar reparaciones
- GET `/api/reparaciones/id/:id` - Obtener reparación
- PUT `/api/reparaciones/:id/diagnostico` - Registrar diagnóstico
- PUT `/api/reparaciones/:id/estado` - Actualizar estado

### Repuestos
- POST `/api/repuestos/reparacion/:reparacion_id` - Agregar repuesto
- GET `/api/repuestos/reparacion/:reparacion_id` - Listar repuestos
- PUT `/api/repuestos/:id` - Actualizar repuesto
- DELETE `/api/repuestos/:id` - Eliminar repuesto

### Facturas
- POST `/api/facturas/reparacion/:reparacion_id` - Generar factura
- GET `/api/facturas` - Listar facturas
- GET `/api/facturas/:id` - Obtener factura
- PUT `/api/facturas/:id/pagar` - Marcar como pagada

## Seguridad

- Autenticación mediante JWT
- Control de acceso basado en roles
- Validación de datos en todas las operaciones
- Protección contra inyección SQL

## Contribución

Si deseas contribuir al proyecto:
1. Crea un fork
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Autor y Créditos

Desarrollado por Felipe Loaiza Castaño y colaboradores.

## Contacto y Soporte

¿Tienes dudas, sugerencias o encontraste un bug? Puedes abrir un issue en este repositorio o contactar al autor principal a través de [tu-email@ejemplo.com].

---

¡Gracias por usar y contribuir a este sistema de gestión para talleres de motos! Si te fue útil, no dudes en darle una estrella ⭐ al repositorio.