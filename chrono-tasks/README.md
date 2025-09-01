# Chrono Tasks

Una aplicación Angular para gestión de tareas con seguimiento de tiempo en tiempo real.

## Características

- ✅ Lista de tareas con información del cliente
- ✅ Creación de nuevas tareas
- ✅ Timer en tiempo real (iniciar timers)
- ✅ Seguimiento de tiempo por tarea
- ✅ Interfaz responsive con Bootstrap
- ✅ API real funcionando en https://oficines.glamsw.com/chrono-test

## ⚠️ Limitaciones Actuales de la API Real

**Nota importante**: La API real tiene varias limitaciones:

### ✅ **Funciona correctamente:**
- Crear tareas (`POST /tasks`)
- Obtener lista de tareas (`GET /tasks`, `GET /tasks?expanded=times`)
- Crear timers (`POST /tasks/{id}/times`)
- Filtro por ID de tarea (`GET /tasks?id={id}`)

### ❌ **No funciona (limitaciones del servidor):**
- Obtener tarea individual (`GET /tasks/{id}` - Error 405)
- Actualizar tiempos (`PUT /tasks/{id}/times/{timeId}` - Error 500)
- Eliminar tiempos (`DELETE /tasks/{id}/times/{timeId}` - Error)
- Parar timers (depende de PUT que no funciona)

### 🔧 **Soluciones implementadas:**
- **Tarea individual**: Usamos filtro `GET /tasks?id={id}` en lugar de `GET /tasks/{id}`
- **Tareas nuevas**: Inicializamos automáticamente `times: []` para evitar errores
- **Manejo de errores**: Mensajes informativos para funcionalidades no disponibles

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd chrono-tasks
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación Angular**
   ```bash
   ng serve
   ```

4. **Abrir la aplicación**
   - Navegar a `http://localhost:4200`

## API Real

La aplicación está configurada para usar la API real por defecto:
- **URL**: `https://oficines.glamsw.com/chrono-test`
- **Token**: Incluido automáticamente en todas las peticiones
- **Endpoints funcionales**: 
  - ✅ `GET /tasks` - Obtener todas las tareas
  - ✅ `GET /tasks?expanded=times` - Obtener tareas con tiempos expandidos
  - ✅ `GET /tasks?id={id}` - Obtener tarea específica (filtro)
  - ✅ `POST /tasks` - Crear nueva tarea
  - ✅ `POST /tasks/{id}/times` - Crear nuevo tiempo
  - ❌ `GET /tasks/{id}` - Obtener tarea individual (Error 405)
  - ❌ `PUT /tasks/{id}/times/{timeId}` - Actualizar tiempo (Error 500)
  - ❌ `DELETE /tasks/{id}/times/{timeId}` - Eliminar tiempo (Error)

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Header con tiempo actual y tarea activa
│   │   ├── task-list/        # Lista de tareas
│   │   ├── task-form/        # Formulario para crear tareas
│   │   ├── task-editor/      # Editor de tareas con tiempos
│   │   └── timer/            # Widget de timer
│   ├── models/
│   │   ├── task.model.ts     # Interfaz Task
│   │   └── time.model.ts     # Interfaz Time
│   ├── services/
│   │   ├── api.service.ts    # Servicio base para API
│   │   ├── task.service.ts   # Servicio para tareas (con filtro por ID)
│   │   ├── time.service.ts   # Servicio para tiempos
│   │   └── current-time.service.ts # Servicio para timer activo
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Interceptor para token de autenticación
│   └── environments/
│       ├── environment.ts    # Configuración desarrollo
│       └── environment.prod.ts # Configuración producción
└── styles.scss              # Estilos globales con Bootstrap
```

## Cambio a Mock API (Opcional)

Si quieres usar json-server para desarrollo local:

1. **Instalar json-server**
   ```bash
   npm install -D json-server
   ```

2. **Crear db.json** (ya incluido en el proyecto)

3. **Iniciar json-server**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Cambiar environment.ts**
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:3000',
     useMockApi: true
   };
   ```

## Headers de Autenticación
Todas las peticiones incluyen automáticamente:
```
x-access-token: 3GBWKoIHxXrI43r3hF0aVRC80IP1Q44rVr0w0O5Ikm0wUQdJcTbX60X1QBXorIjs
```

## Funcionalidades

### Timer en Tiempo Real
- ✅ Se pueden iniciar timers para cualquier tarea (nuevas y existentes)
- ✅ Solo puede haber un tiempo activo a la vez (lógica implementada)
- ✅ El header muestra la tarea activa y el tiempo transcurrido
- ✅ Actualización en tiempo real cada segundo
- ❌ Parar timers (limitación de la API - endpoint PUT no funciona)

### Gestión de Tareas
- ✅ Crear, editar y eliminar tareas
- ✅ Asignar cliente y descripción
- ✅ Ver historial de tiempos por tarea
- ✅ Tiempo total acumulado por tarea
- ✅ Navegación a editor de tareas individuales

### Interfaz de Usuario
- ✅ Diseño responsive con Bootstrap
- ✅ Header fijo con información en tiempo real
- ✅ Cards para mostrar tareas
- ✅ Formularios validados
- ✅ Botones de acción intuitivos
- ✅ Manejo de errores con mensajes informativos

## Comandos Útiles

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo
ng build                    # Build de producción
ng test                     # Ejecutar tests

# Mock API (opcional)
npx json-server --watch db.json --port 3000

# Producción
ng build --configuration production
```

## Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **SCSS** - Preprocesador CSS

## Estado del Proyecto

✅ **COMPLETADO** - Aplicación funcional con:
- API real conectada y funcionando (con limitaciones conocidas)
- Timer en tiempo real (iniciar)
- Gestión completa de tareas
- Interfaz responsive
- Autenticación automática
- Manejo robusto de errores de API

## Próximos Pasos

Para completar la funcionalidad:
1. Resolver problemas con endpoints PUT y DELETE en la API real
2. Implementar funcionalidad completa de parar timers
3. Añadir funcionalidad de eliminar tiempos
4. Implementar endpoint GET /tasks/{id} en la API real

## Notas Técnicas

- **Formato de datos**: La API real usa `end_date: ""` (string vacío) para tiempos activos
- **Unidades de tiempo**: `spent_time` se maneja en horas (decimal), no segundos
- **Filtros**: Usamos `GET /tasks?id={id}` en lugar de `GET /tasks/{id}` para obtener tareas individuales
- **Inicialización**: Las tareas nuevas se inicializan automáticamente con `times: []`

## Licencia

Este proyecto está bajo la Licencia MIT.
