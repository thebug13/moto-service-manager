# Funcionalidad de Nómina - Desprendibles Individuales

## Descripción
Se ha implementado la funcionalidad para descargar individualmente el desprendible de nómina de cada empleado en formato PDF, permitiendo enviar los documentos de forma individual a cada auxiliar.

## Características Implementadas

### 1. Descarga Individual de Desprendibles
- **Ubicación**: Tabla principal de nómina
- **Botón**: "Descargar PDF" junto a cada auxiliar
- **Funcionalidad**: Genera y descarga automáticamente el desprendible individual

### 2. Contenido del Desprendible PDF
El PDF generado incluye:

#### Encabezado
- Título: "DESPRENDIBLE DE NÓMINA"
- Información de la empresa: "TALLER CRUD NODE"

#### Datos del Empleado
- Nombre del auxiliar
- Período de pago (fechas desde/hasta)
- Fecha de emisión del documento

#### Resumen de Ingresos
- Total de mano de obra generada
- Porcentaje aplicado
- Salario a pagar

#### Detalle de Trabajos
- Tabla con todas las reparaciones realizadas
- Incluye: fecha, placa, marca/modelo, cliente, estado, mano de obra
- Total de mano de obra al final

#### Pie de Página
- Texto oficial del documento

## Cómo Usar

### 1. Acceder a la Nómina
1. Navegar a la sección de Nómina
2. Seleccionar las fechas del período
3. Configurar el porcentaje de mano de obra
4. Hacer clic en "Calcular Nómina"

### 2. Descargar Desprendible Individual
1. En la tabla de resultados, cada auxiliar tiene dos botones:
   - **"Ver Detalles"**: Abre modal con detalles
   - **"Descargar PDF"**: Genera y descarga el desprendible individual

2. Hacer clic en "Descargar PDF" para el auxiliar deseado
3. El archivo se descargará automáticamente con el nombre:
   ```
   desprendible_[Nombre_Auxiliar]_[Fecha_Desde]_[Fecha_Hasta].pdf
   ```

### 3. Enviar a los Empleados
- Los archivos PDF generados están listos para ser enviados por email
- Cada archivo contiene toda la información necesaria para el empleado
- El formato es profesional y oficial

## Ventajas de la Nueva Funcionalidad

1. **Eficiencia**: No es necesario abrir los detalles para generar el PDF
2. **Individualización**: Cada empleado recibe su documento específico
3. **Profesionalismo**: Formato oficial con toda la información necesaria
4. **Facilidad**: Un solo clic para generar y descargar
5. **Organización**: Nombres de archivo descriptivos y organizados

## Requisitos Técnicos

### Frontend
- Angular 20+
- jsPDF 3.0.1+
- jspdf-autotable 5.0.2+

### Backend
- Node.js con Express
- MySQL/SQLite
- Rutas de reporte implementadas

## Archivos Modificados

### Frontend
- `frontend/src/app/components/payroll/payroll.component.ts`
  - Nueva función `generarDesprendibleIndividual()`
  - Nueva función `generarPDFDesprendible()`

- `frontend/src/app/components/payroll/payroll.component.html`
  - Nuevo botón "Descargar PDF" en la tabla

- `frontend/src/app/components/payroll/payroll.component.css`
  - Estilos para los botones de acción

### Backend
- Las rutas y controladores ya estaban implementados
- No se requirieron cambios adicionales

## Notas Importantes

1. **Permisos**: Solo usuarios con rol "Administrador" o "Jefe de taller" pueden acceder
2. **Datos**: Los datos se obtienen en tiempo real desde la base de datos
3. **Formato**: Los PDFs se generan en el navegador del cliente
4. **Compatibilidad**: Funciona en todos los navegadores modernos

## Próximas Mejoras Sugeridas

1. **Envío por Email**: Integrar envío automático por email
2. **Plantillas Personalizables**: Permitir personalizar el diseño del PDF
3. **Firma Digital**: Agregar firma digital al documento
4. **Historial**: Mantener historial de desprendibles generados
5. **Notificaciones**: Notificar a empleados cuando se genera su desprendible 