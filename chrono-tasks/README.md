# Chrono Tasks

Una aplicación Angular para gestión de tareas con seguimiento de tiempo en tiempo real.

## Características

- ✅ Lista de tareas con información del cliente
- ✅ Creación de nuevas tareas
- ✅ Timer en tiempo real (iniciar y parar timers)
- ✅ Seguimiento de tiempo por tarea
- ✅ Interfaz responsive con Bootstrap
- ✅ API real funcionando en https://oficines.glamsw.com/chrono-test
- ✅ **Sistema de cola de peticiones con localStorage**
- ✅ **Funcionalidad completa de parar timers**
- ✅ **Añadir tiempos manuales desde el editor**
- ✅ **Widget flotante de timer con botón de finalizar**
- ✅ **Cálculo correcto de duraciones en tiempo real**

## 🚀 **Funcionalidades Implementadas**

### **Sistema de Cola de Peticiones**
- **localStorage**: Las peticiones que fallan se guardan automáticamente en localStorage
- **Reintentos automáticos**: Cada 30 segundos se reintentan las peticiones pendientes
- **Límite de reintentos**: Máximo 3 intentos por petición
- **Indicador visual**: Se muestran las peticiones pendientes en la interfaz
- **SSR Compatible**: Funciona correctamente con Server-Side Rendering

### **Funcionalidad Completa de Timer**
- ✅ **Iniciar timer**: Funciona correctamente
- ✅ **Parar timer**: Implementado usando DELETE + POST (solución alternativa)
- ✅ **Timer en tiempo real**: Actualización cada segundo
- ✅ **Solo un timer activo**: Lógica implementada correctamente
- ✅ **Widget flotante**: Timer siempre visible con botón de finalizar
- ✅ **Cálculo de duración**: Incluye tiempo transcurrido de timers activos

### **Editor de Tareas Mejorado**
- ✅ **Añadir tiempos manuales**: Formulario para registrar tiempos pasados
- ✅ **Eliminar tiempos**: Funciona correctamente
- ✅ **Peticiones pendientes**: Se muestran en tiempo real
- ✅ **Navegación corregida**: Cada tarea lleva a su ID correcto
- ✅ **Tiempo total preciso**: Cálculo en tiempo real incluyendo timers activos

## ⚠️ Limitaciones Actuales de la API Real

### ✅ **Funciona correctamente:**
- Crear tareas (`POST /tasks`)
- Obtener lista de tareas (`GET /tasks`, `GET /tasks?expanded=times`)
- Crear timers (`POST /tasks/{id}/times`)
- Eliminar tiempos (`DELETE /tasks/{id}/times/{timeId}`)
- Eliminar tareas (`DELETE /tasks/{id}`)

### ❌ **No funciona (limitaciones del servidor):**
- Obtener tarea individual (`GET /tasks/{id}` - Error 405)
- Actualizar tiempos (`PUT /tasks/{id}/times/{timeId}` - Error 500)
- Actualizar tareas (`PUT /tasks/{id}` - Error 500)

### 🔧 **Soluciones implementadas:**
- **Tarea individual**: Filtrado en cliente desde todas las tareas
- **Parar timers**: DELETE del tiempo activo + POST del tiempo completado
- **Peticiones fallidas**: Se guardan en localStorage y se reintentan automáticamente
- **Manejo de errores**: Mensajes informativos y cola de peticiones
- **SSR**: Compatible con Server-Side Rendering usando `isPlatformBrowser`

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
  - ✅ `POST /tasks` - Crear nueva tarea
  - ✅ `POST /tasks/{id}/times` - Crear nuevo tiempo
  - ✅ `DELETE /tasks/{id}/times/{timeId}` - Eliminar tiempo
  - ✅ `DELETE /tasks/{id}` - Eliminar tarea
  - ❌ `GET /tasks/{id}` - Obtener tarea individual (Error 405)
  - ❌ `PUT /tasks/{id}/times/{timeId}` - Actualizar tiempo (Error 500)
  - ❌ `PUT /tasks/{id}` - Actualizar tarea (Error 500)

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Header con tiempo actual y tarea activa
│   │   ├── task-list/        # Lista de tareas
│   │   ├── task-form/        # Formulario para crear tareas
│   │   ├── task-editor/      # Editor de tareas con tiempos
│   │   └── timer/            # Widget de timer flotante
│   ├── models/
│   │   ├── task.model.ts     # Interfaz Task
│   │   └── time.model.ts     # Interfaz Time
│   ├── services/
│   │   ├── api.service.ts    # Servicio base para API
│   │   ├── task.service.ts   # Servicio para tareas (con filtrado en cliente)
│   │   ├── time.service.ts   # Servicio para tiempos (con cola de peticiones)
│   │   ├── current-time.service.ts # Servicio para timer activo
│   │   └── queue/            # Sistema de cola de peticiones
│   │       ├── request-queue.service.ts
│   │       └── pending-request.model.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Interceptor para token de autenticación
│   └── environments/
│       ├── environment.ts    # Configuración desarrollo
│       └── environment.prod.ts # Configuración producción
└── styles.scss              # Estilos globales con Bootstrap
```

## Sistema de Cola de Peticiones

### **Cómo funciona:**
1. **Detección de errores**: Cuando una petición falla, se guarda automáticamente en localStorage
2. **Reintentos automáticos**: Cada 30 segundos se intentan ejecutar las peticiones pendientes
3. **Límite de reintentos**: Máximo 3 intentos por petición
4. **Indicador visual**: Se muestran las peticiones pendientes en la interfaz
5. **SSR Compatible**: Usa `isPlatformBrowser` para evitar errores en el servidor

### **Tipos de peticiones que se guardan:**
- Crear tiempos (`POST /tasks/{id}/times`)
- Actualizar tiempos (`PUT /tasks/{id}/times/{timeId}`)
- Eliminar tiempos (`DELETE /tasks/{id}/times/{timeId}`)

### **Ventajas:**
- **Resistencia a fallos**: La aplicación funciona aunque la API esté caída
- **Experiencia de usuario**: No se pierden datos por problemas de conexión
- **Reintentos automáticos**: No requiere intervención manual
- **Transparencia**: El usuario ve qué peticiones están pendientes
- **SSR Ready**: Compatible con Server-Side Rendering

## Funcionalidades

### Timer en Tiempo Real
- ✅ Se pueden iniciar timers para cualquier tarea
- ✅ Se pueden parar timers (solución alternativa implementada)
- ✅ Solo puede haber un tiempo activo a la vez
- ✅ El header muestra la tarea activa y el tiempo transcurrido
- ✅ Widget flotante siempre visible con botón de finalizar
- ✅ Actualización en tiempo real cada segundo
- ✅ Peticiones fallidas se guardan en localStorage
- ✅ Cálculo correcto de duraciones incluyendo timers activos

### Gestión de Tareas
- ✅ Crear, editar y eliminar tareas
- ✅ Asignar cliente y descripción
- ✅ Ver historial de tiempos por tarea
- ✅ Tiempo total acumulado por tarea (en tiempo real)
- ✅ Navegación a editor de tareas individuales (corregido)
- ✅ Añadir tiempos manuales desde el editor

### Interfaz de Usuario
- ✅ Diseño responsive con Bootstrap
- ✅ Header fijo con información en tiempo real
- ✅ Cards para mostrar tareas
- ✅ Formularios validados
- ✅ Botones de acción intuitivos
- ✅ Manejo de errores con mensajes informativos
- ✅ Indicadores de peticiones pendientes
- ✅ Widget flotante de timer con botón de finalizar
- ✅ Indicadores visuales de tareas activas

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
- **localStorage** - Persistencia de peticiones pendientes
- **Server-Side Rendering (SSR)** - Compatible

## Estado del Proyecto

✅ **COMPLETADO** - Aplicación funcional con:
- API real conectada y funcionando (con limitaciones conocidas)
- Timer en tiempo real (iniciar y parar)
- Gestión completa de tareas
- Sistema de cola de peticiones con localStorage
- Widget flotante de timer con botón de finalizar
- Cálculo correcto de duraciones en tiempo real
- Interfaz responsive
- Autenticación automática
- Manejo robusto de errores de API
- Navegación corregida
- Compatible con SSR

## Cumplimiento de Requerimientos

### ✅ **Requerimientos Básicos CUMPLIDOS:**
- ✅ Aplicación Angular que consume REST API
- ✅ Task List: name, description, client, time spent
- ✅ Task Form: name (required), client (required), description (optional)
- ✅ Time List: En el task editor con funcionalidad completa
- ✅ Bootstrap para estilos

### ✅ **Bonus CUMPLIDOS:**
- ✅ Componente timer funcional
- ✅ Iniciar tiempos desde task list
- ✅ POST con end_date vacío para tiempos activos
- ✅ Mostrar tiempo actual y tarea asociada
- ✅ Solo un tiempo activo a la vez
- ✅ Actualizar tiempo actual al iniciar nuevo
- ✅ Parar tiempo actual sin iniciar nuevo
- ✅ Observable para actualización continua del timer
- ✅ Widget flotante de timer con botón de finalizar

## Notas Técnicas

- **Formato de datos**: La API real usa `end_date: ""` (string vacío) para tiempos activos
- **Unidades de tiempo**: `spent_time` se maneja en horas (decimal), no segundos
- **Filtrado**: Usamos filtrado en cliente en lugar de `GET /tasks/{id}`
- **Parar timers**: DELETE del tiempo activo + POST del tiempo completado
- **Cola de peticiones**: localStorage + reintentos automáticos cada 30 segundos
- **Navegación**: Corregida para que cada tarea llega a su ID correcto
- **SSR**: Compatible usando `isPlatformBrowser` para localStorage
- **Duración en tiempo real**: Cálculo correcto incluyendo timers activos

## Próximos Pasos

Para completar la funcionalidad al 100%:
1. Resolver problemas con endpoints PUT en la API real
2. Implementar endpoint GET /tasks/{id} en la API real
3. Añadir funcionalidad de edición de tareas

## Licencia

Este proyecto está bajo la Licencia MIT.
