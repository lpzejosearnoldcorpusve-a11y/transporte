# Sistema de Transporte de Hidrocarburos

Sistema de gestión para empresas de transporte de hidrocarburos construido con Next.js, Tailwind CSS 3.4.x, Drizzle ORM y Neon Database.

## Estructura del Proyecto

\`\`\`
├── app/                      # Rutas de Next.js
│   ├── api/                 # API Routes
│   │   ├── auth/           # Autenticación (login, logout, me, seed)
│   │   ├── users/          # CRUD de usuarios
│   │   ├── roles/          # CRUD de roles
│   │   ├── vehiculos/      # CRUD de vehículos
│   │   ├── rutas/          # CRUD de rutas con Google Maps
│   │   ├── mantenimientos/ # CRUD de mantenimientos
│   │   ├── conductores/    # CRUD de conductores
│   │   └── documentos/     # CRUD de documentos de conductores
│   ├── dashboard/           # Páginas del dashboard
│   │   ├── users-roles/    # Gestión de usuarios y roles
│   │   ├── vehiculos/      # Gestión de vehículos
│   │   ├── rutas/          # Gestión de rutas
│   │   ├── viajes/         # Gestión de viajes
│   │   ├── gps-tracking/   # GPS Tracking en Tiempo Real
│   │   └── dispositivos-gps/ # Gestión de Dispositivos GPS
│   ├── layout.tsx           # Layout principal con AuthProvider
│   ├── page.tsx             # Página de login
│   └── globals.css          # Estilos globales
├── components/
│   ├── animations/          # Animaciones (WelcomeAnimation)
│   ├── common/              # Componentes comunes (Logo, UserMenu)
│   ├── forms/               # Formularios (LoginForm)
│   ├── layouts/             # Layouts (DashboardLayout)
│   ├── navigation/          # Navegación (Sidebar, Header)
│   ├── pages/               # Contenido de páginas
│   ├── users-roles/         # Componentes de usuarios y roles
│   ├── vehiculos/           # Componentes de vehículos (5 archivos)
│   ├── rutas/               # Componentes de rutas (5 archivos)
│   ├── mantenimientos/      # Componentes de mantenimientos (8 archivos)
│   ├── conductores/         # Componentes de conductores (4 archivos)
│   ├── documentos/          # Componentes de documentos de conductores
│   ├── viajes/              # Componentes de viajes (6 archivos)
│   ├── gps-tracking/        # Componentes de GPS Tracking (6 archivos)
│   └── dispositivos-gps/    # Componentes de Dispositivos GPS (6 archivos)
├── db/                      # Base de datos
│   ├── schema.ts           # Esquemas (usuarios, roles, sesiones, vehículos, rutas, mantenimientos, conductores, documentos)
│   ├── index.ts            # Conexión a la base de datos
│   └── migrate.ts          # Script de migración
├── hooks/                   # Hooks personalizados
│   ├── use-toast.ts        # Hook de notificaciones
│   ├── use-vehiculos.ts    # Hook para obtener vehículos
│   ├── use-vehiculo-mutations.ts  # Hook para CRUD de vehículos
│   ├── use-rutas.ts        # Hook para obtener rutas
│   ├── use-ruta-mutations.ts      # Hook para CRUD de rutas
│   ├── use-mantenimientos.ts # Hook para obtener mantenimientos
│   ├── use-mantenimiento-mutations.ts # Hook para CRUD de mantenimientos
│   ├── use-conductores.ts    # Hook para obtener conductores
│   ├── use-conductor-mutations.ts # Hook para CRUD de conductores
│   ├── use-documentos.ts     # Hook para obtener documentos de conductores
│   ├── use-documento-mutations.ts # Hook para CRUD de documentos de conductores
│   ├── use-viajes.ts         # Hook para obtener viajes
│   ├── use-viaje-mutations.ts # Hook para CRUD de viajes
│   ├── use-gps-tracking.ts   # Hook para obtener datos de GPS Tracking
│   └── use-dispositivos-gps.ts # Hook para obtener datos de Dispositivos GPS
├── lib/                     # Utilidades
│   ├── auth.ts             # Funciones de autenticación
│   ├── auth-context.tsx    # Contexto de autenticación
│   ├── utils.ts            # Utilidades generales
│   ├── google-maps.ts      # Integración con Google Maps API
│   ├── cloudinary.ts       # Integración con Cloudinary
│   ├── osrm.ts             # Integración con OSRM
│   ├── nominatim.ts        # Integración con Nominatim
│   └── staticmap.ts        # Integración con StaticMap
├── types/                   # Tipos TypeScript
│   ├── vehiculo.ts         # Tipos de vehículos
│   ├── ruta.ts             # Tipos de rutas
│   ├── mantenimiento.ts    # Tipos de mantenimientos
│   ├── conductor.ts        # Tipos de conductores
│   └── documento.ts       # Tipos de documentos de conductores
├── middleware.ts            # Protección de rutas
└── public/
    └── assets/              # Imágenes y logos (coloca aquí tus archivos)
\`\`\`

## Colores del Sistema

- **Verde Oscuro**: `#144230` (forest-green-900)
- **Naranja**: `#f97316` (vibrant-orange-500)
- **Blanco**: `#ffffff`

## Instalación

1. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

2. Configura las variables de entorno:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Agrega tus credenciales en `.env.local`:
\`\`\`
DATABASE_URL=postgresql://user:password@host/database
GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
\`\`\`

3. Ejecuta las migraciones de la base de datos:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

4. Crea el usuario administrador de prueba:
\`\`\`bash
# Llama a la API de seed desde tu navegador o con curl:
curl -X POST http://localhost:3000/api/auth/seed
\`\`\`

Esto creará el usuario administrador:
- **Email**: admin@gmail.com
- **Contraseña**: hola1234

5. Coloca tu logo en `public/assets/` y actualiza `components/common/logo.tsx`

6. Ejecuta el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Características

### Autenticación
- ✅ Sistema de autenticación completo con sesiones
- ✅ Animación de bienvenida futurista con Framer Motion
- ✅ Sistema de permisos basado en roles
- ✅ Protección de rutas con middleware

### Gestión de Usuarios y Roles
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de roles
- ✅ Asignación de roles a usuarios
- ✅ Gestión de permisos

### Gestión de Vehículos
- ✅ CRUD completo de vehículos
- ✅ Estados: activo, mantenimiento, inactivo
- ✅ Cambio de estado automático para mantenimiento
- ✅ Registro de documentación (SOAT, ITV, Permisos)
- ✅ Alertas de vencimiento de documentos
- ✅ Integración con GPS
- ✅ Componentes modulares (5 archivos separados)

### Gestión de Mantenimiento
- ✅ CRUD completo de mantenimientos
- ✅ Subida de fichas de mantenimiento (múltiples archivos)
- ✅ OCR automático para extracción de datos
- ✅ Registro de partes interiores y exteriores cambiadas
- ✅ Galería multimedia con previsualizador
- ✅ Validación obligatoria de fichas antes de completar
- ✅ 8 componentes modulares separados
- ✅ Animaciones fluidas con Framer Motion

### Gestión de Conductores
- ✅ CRUD completo de conductores
- ✅ Registro de datos: nombre, apellido, CI, licencia, categoría
- ✅ Control de vencimiento de licencias
- ✅ Contacto y dirección
- ✅ Estados de licencia con indicadores visuales
- ✅ 4 componentes modulares separados

### Gestión de Documentos de Conductor
- ✅ Sistema de almacenamiento con Cloudinary
- ✅ Subida de cualquier tipo de archivo (PDF, JPG, PNG, etc.)
- ✅ Categorización por tipo de documento
- ✅ Generador de contratos con firma digital
- ✅ Sistema de validación y fiscalización
- ✅ Visor integrado para documentos
- ✅ Soporte para múltiples formatos de archivo

### Gestión de Rutas
- ✅ CRUD completo de rutas
- ✅ Integración con OpenStreetMap (Leaflet)
- ✅ Cálculo automático de distancia y duración con OSRM
- ✅ Geocodificación de direcciones con Nominatim
- ✅ Selector de ubicación interactivo con mapa centrado en Bolivia
- ✅ Rutas que siguen carreteras reales (no líneas rectas)
- ✅ Mapas estáticos para previsualización
- ✅ Asignación de vehículos a rutas
- ✅ Estados de ruta (planificada, en curso, completada, cancelada)
- ✅ 5 componentes modulares separados

### Gestión de Viajes
- ✅ CRUD completo de viajes
- ✅ Asignación de vehículos y conductores
- ✅ Registro de producto y cantidad
- ✅ Lugar de carga y descarga
- ✅ Generación de hoja de ruta en PDF con QR
- ✅ QR escaneable que abre la ruta en OpenStreetMap
- ✅ Información completa del vehículo y conductor en PDF
- ✅ Vista tabla y cuadrícula
- ✅ 6 componentes modulares separados
- ✅ Animaciones fluidas con Framer Motion

### GPS Tracking en Tiempo Real
- ✅ CRUD completo de dispositivos GPS
- ✅ Tabla de dispositivos activos con estado en tiempo real
- ✅ Actualización automática cada 3-5 segundos
- ✅ Mapa interactivo con OpenStreetMap
- ✅ Marcadores animados de vehículos
- ✅ Panel lateral con información detallada
- ✅ Estadísticas de velocidad, altitud, satélites
- ✅ Historial de posiciones
- ✅ Sistema de vinculación vehículo-dispositivo
- ✅ 6 componentes modulares separados

### Gestión de Dispositivos GPS
- ✅ CRUD completo de dispositivos GPS
- ✅ Registro de IMEI, modelo, marca
- ✅ Vinculación automática con vehículos
- ✅ Configuración de alertas e intervalos
- ✅ Estados de conexión con indicadores visuales
- ✅ Recepción de datos en tiempo real (latitud, longitud, altitud, satélites)
- ✅ 6 componentes modulares separados

### Diseño
- ✅ Dashboard con navegación vertical
- ✅ Componentes modulares y reutilizables
- ✅ Tailwind CSS 3.4.x
- ✅ Next.js 15 (estable)
- ✅ Diseño responsive
- ✅ Sistema de notificaciones (toasts)
- ✅ Animaciones fluidas con Framer Motion
- ✅ Colores personalizados: Verde Oscuro, Naranja, Blanco

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run db:generate` - Genera migraciones de Drizzle
- `npm run db:migrate` - Ejecuta las migraciones
- `npm run db:studio` - Abre Drizzle Studio para ver la base de datos
- `npm run db:push` - Sincroniza el esquema con la base de datos

## Uso

### Iniciar Sesión
1. Accede a `http://localhost:3000`
2. Ingresa las credenciales: admin@gmail.com / hola1234
3. Disfruta de la animación de bienvenida
4. Serás redirigido al dashboard

### Gestionar Usuarios y Roles
1. Ve a "Usuarios y Roles" en el sidebar
2. Usa las pestañas para alternar entre usuarios y roles
3. Crea, edita o elimina usuarios y roles según sea necesario

### Gestionar Vehículos
1. Ve a "Vehículos" en el sidebar
2. Crea nuevos vehículos con toda su documentación
3. El sistema te alertará sobre documentos próximos a vencer
4. Cambia el estado a "mantenimiento" para iniciar proceso
5. Edita o elimina vehículos según sea necesario

### Gestionar Mantenimiento
1. Ve a "Mantenimiento" en el sidebar
2. Selecciona un vehículo del grid animado
3. Sube fichas de mantenimiento (PDF, imágenes)
4. El OCR extraerá datos automáticamente
5. Registra partes interiores y exteriores cambiadas
6. Valida y fiscaliza antes de completar
7. Al completar, el vehículo vuelve a estado "activo"

### Gestionar Conductores
1. Ve a "Conductores" en el sidebar
2. Crea nuevos conductores con datos completos
3. El sistema monitoreará vencimiento de licencias
4. Edita información según sea necesario

### Gestionar Documentos de Conductor
1. Ve a "Documentación" en el sidebar (bajo Conductores)
2. Selecciona un conductor
3. Sube documentos (carnet, carnet de conducir, croquis, etc.)
4. Los archivos se almacenan en Cloudinary
5. Genera contratos con firma digital
6. Todos los documentos quedan validados y fiscalizados

### Gestionar Rutas
1. Ve a "Rutas" en el sidebar
2. Crea una nueva ruta
3. Haz clic en "Seleccionar Origen" para abrir el mapa
4. Navega en el mapa de Bolivia y haz clic para seleccionar origen
5. Repite para seleccionar destino
6. El sistema calcula automáticamente la ruta por carreteras reales
7. Asigna un vehículo
8. La hoja de ruta se genera automáticamente

### Gestionar Viajes
1. Ve a "Viajes" en el sidebar
2. Crea un nuevo viaje
3. Selecciona vehículo, conductor, producto y cantidad
4. Ingresa lugares de carga y descarga
5. El sistema genera automáticamente la hoja de ruta
6. Descarga el PDF con QR para el transportista
7. El QR abre la ruta en OpenStreetMap al escanearse
8. Alterna entre vista tabla y cuadrícula

### GPS Tracking en Tiempo Real
1. Ve a "GPS Tracking" en el sidebar
2. Visualiza todos los vehículos en tiempo real en el mapa
3. Panel lateral muestra lista de vehículos conectados
4. Haz clic en un vehículo para ver detalles
5. Estadísticas: velocidad, altitud, satélites, última actualización
6. Los dispositivos envían datos cada 3-5 segundos

### Gestionar Dispositivos GPS
1. Ve a "Dispositivos GPS" en el sidebar (bajo GPS)
2. Visualiza grid de dispositivos activos
3. Crea nuevo dispositivo ingresando IMEI
4. Vincula dispositivo con un vehículo
5. Configura alertas e intervalos de reporte
6. Monitorea estado de conexión en tiempo real
7. Recibe datos de: latitud, longitud, altitud, satélites

## Integración con OpenStreetMap

El sistema utiliza OpenStreetMap y servicios gratuitos para:
- Leaflet: Mapas interactivos
- Nominatim: Geocodificación de direcciones
- OSRM: Cálculo de rutas por carreteras reales
- StaticMap: Generación de imágenes estáticas de mapas

No se requiere API key para estos servicios. Todo funciona de forma gratuita y sin restricciones.

## Integración con Cloudinary

El sistema utiliza Cloudinary para gestionar documentos:
- Almacenamiento de múltiples formatos (PDF, JPG, PNG, etc.)
- Optimización automática de archivos
- Acceso a archivos desde cualquier lugar
- Eliminación automática al borrar documentos

Configura tus credenciales en `.env.local`:
\`\`\`
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
\`\`\`

## Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS 3.4.x
- **Animaciones**: Framer Motion
- **Base de datos**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Autenticación**: Sesiones con cookies HTTP-only
- **Seguridad**: bcryptjs para hash de contraseñas
- **Mapas**: OpenStreetMap, Leaflet, OSRM, Nominatim
- **Almacenamiento**: Cloudinary para documentos
- **PDF**: jsPDF, react-pdf para generación y visualización
- **QR**: qrcode.react para generación de códigos QR
- **Iconos**: Lucide React
- **Utilidades**: date-fns para manejo de fechas, SWR para fetching

## Arquitectura de Componentes

El proyecto sigue una arquitectura modular donde cada módulo está separado en:

1. **Types** (`types/`): Definiciones de TypeScript centralizadas
2. **Hooks** (`hooks/`): Lógica de datos reutilizable con SWR
3. **Components** (`components/`): Componentes visuales separados (3-8 por módulo)
4. **API Routes** (`app/api/`): Endpoints REST para CRUD
5. **Pages** (`app/dashboard/`): Páginas que integran todo

Cada módulo es completamente independiente y puede ser utilizado o modificado sin afectar otros módulos.

## Módulos Disponibles

1. **Autenticación** - Login, sesiones, permisos
2. **Usuarios y Roles** - Gestión de acceso
3. **Vehículos** - Registro y control de flotas
4. **Mantenimiento** - Gestión de servicios técnicos
5. **Conductores** - Registro de personal
6. **Documentos de Conductor** - Almacenamiento seguro
7. **Rutas** - Planificación de trayectos
8. **Viajes** - Gestión de transportes
9. **GPS Tracking** - Seguimiento en tiempo real
10. **Dispositivos GPS** - Gestión de hardware

Todos los módulos tienen ABM completo (Altas, Bajas, Modificaciones) y están completamente funcionales.
