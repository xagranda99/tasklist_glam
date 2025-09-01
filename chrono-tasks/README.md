# Chrono Tasks

Una aplicación Angular para gestión de tareas con seguimiento de tiempo en tiempo real.

## Características

- ✅ Lista de tareas con información del cliente
- ✅ Creación de nuevas tareas
- ✅ Timer en tiempo real con un solo tiempo activo a la vez
- ✅ Seguimiento de tiempo por tarea
- ✅ Interfaz responsive con Bootstrap
- ✅ Mock API con json-server (fácil cambio a API real)

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

3. **Iniciar el servidor mock (json-server)**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **En otra terminal, iniciar la aplicación Angular**
   ```bash
   ng serve
   ```

5. **Abrir la aplicación**
   - Navegar a `http://localhost:4200`

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
│   │   ├── task.service.ts   # Servicio para tareas
│   │   ├── time.service.ts   # Servicio para tiempos
│   │   └── current-time.service.ts # Servicio para timer activo
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Interceptor para token de autenticación
│   └── environments/
│       ├── environment.ts    # Configuración desarrollo
│       └── environment.prod.ts # Configuración producción
├── db.json                   # Datos mock para json-server
└── styles.scss              # Estilos globales con Bootstrap
```

## Cambio a API Real

Para cambiar de Mock API a API real, simplemente modificar los archivos de environment:

### environment.ts (desarrollo)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://oficines.glamsw.com/chrono-test',
  useMockApi: false
};
```

### environment.prod.ts (producción)
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://oficines.glamsw.com/chrono-test',
  useMockApi: false
};
```

**No se requieren cambios adicionales en el código** - el `ApiService` automáticamente usará la nueva URL.

## API Endpoints

### Mock API (json-server)
- `GET /tasks` - Obtener todas las tareas
- `GET /tasks?expanded=times` - Obtener tareas con tiempos expandidos
- `GET /tasks/:id` - Obtener tarea específica
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea
- `GET /tasks/:id/times` - Obtener tiempos de una tarea
- `POST /tasks/:id/times` - Crear nuevo tiempo
- `PUT /tasks/:id/times/:timeId` - Actualizar tiempo
- `DELETE /tasks/:id/times/:timeId` - Eliminar tiempo

### Headers de Autenticación
Todas las peticiones incluyen automáticamente:
```
x-access-token: 3GBWKoIHxXrI43r3hF0aVRC80IP1Q44rVr0w0O5Ikm0wUQdJcTbX60X1QBXorIjs
```

## Funcionalidades

### Timer en Tiempo Real
- Solo puede haber un tiempo activo a la vez
- Al iniciar un nuevo timer, se detiene automáticamente el anterior
- El header muestra la tarea activa y el tiempo transcurrido
- Actualización en tiempo real cada segundo

### Gestión de Tareas
- Crear, editar y eliminar tareas
- Asignar cliente y descripción
- Ver historial de tiempos por tarea
- Tiempo total acumulado por tarea

### Interfaz de Usuario
- Diseño responsive con Bootstrap
- Header fijo con información en tiempo real
- Cards para mostrar tareas
- Formularios validados
- Botones de acción intuitivos

## Comandos Útiles

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo
ng build                    # Build de producción
ng test                     # Ejecutar tests

# Mock API
npx json-server --watch db.json --port 3000

# Producción
ng build --configuration production
```

## Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **json-server** - Mock API
- **SCSS** - Preprocesador CSS

## Licencia

Este proyecto está bajo la Licencia MIT.
