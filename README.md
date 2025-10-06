This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

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
│   │   └── rutas/          # CRUD de rutas con Google Maps
│   ├── dashboard/           # Páginas del dashboard
│   │   ├── users-roles/    # Gestión de usuarios y roles
│   │   ├── vehiculos/      # Gestión de vehículos
│   │   ├── rutas/          # Gestión de rutas
│   │   └── settings/       # Configuración
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
│   └── ui/                  # Componentes UI básicos
├── db/                      # Base de datos
│   ├── schema.ts           # Esquemas (usuarios, roles, sesiones, vehículos, rutas)
│   ├── index.ts            # Conexión a la base de datos
│   └── migrate.ts          # Script de migración
├── hooks/                   # Hooks personalizados
│   ├── use-toast.ts        # Hook de notificaciones
│   ├── use-vehiculos.ts    # Hook para obtener vehículos
│   ├── use-vehiculo-mutations.ts  # Hook para CRUD de vehículos
│   ├── use-rutas.ts        # Hook para obtener rutas
│   └── use-ruta-mutations.ts      # Hook para CRUD de rutas
├── lib/                     # Utilidades
│   ├── auth.ts             # Funciones de autenticación
│   ├── auth-context.tsx    # Contexto de autenticación
│   ├── utils.ts            # Utilidades generales
│   └── google-maps.ts      # Integración con Google Maps API
├── types/                   # Tipos TypeScript
│   ├── vehiculo.ts         # Tipos de vehículos
│   └── ruta.ts             # Tipos de rutas
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
- ✅ Registro de documentación (SOAT, ITV, Permisos)
- ✅ Alertas de vencimiento de documentos
- ✅ Integración con GPS
- ✅ Componentes modulares (5 archivos separados)

### Gestión de Rutas
- ✅ CRUD completo de rutas
- ✅ Integración con Google Maps API
- ✅ Cálculo automático de distancia y duración
- ✅ Geocodificación de direcciones
- ✅ Asignación de vehículos a rutas
- ✅ Estados de ruta (planificada, en curso, completada, cancelada)
- ✅ Seguimiento con hardware especializado
- ✅ Componentes modulares (5 archivos separados)

### Diseño
- ✅ Dashboard con navegación vertical
- ✅ Componentes modulares y reutilizables
- ✅ Tailwind CSS 3.4.x
- ✅ Next.js 15 (estable)
- ✅ Diseño responsive
- ✅ Sistema de notificaciones (toasts)

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
4. Edita o elimina vehículos según sea necesario

### Gestionar Rutas
1. Ve a "Rutas" en el sidebar
2. Crea una nueva ruta ingresando origen y destino
3. El sistema calculará automáticamente la distancia y duración usando Google Maps
4. Asigna un vehículo a la ruta
5. Programa la fecha de salida
6. El sistema calculará la fecha de llegada estimada

## Integración con Google Maps

El sistema utiliza Google Maps API para:
- Geocodificar direcciones (obtener coordenadas)
- Calcular distancias entre origen y destino
- Calcular duración estimada del viaje
- Almacenar coordenadas para seguimiento con hardware GPS

### Configuración de Google Maps API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Distance Matrix API
   - Geocoding API
4. Crea una API Key
5. Agrega la API Key a tu `.env.local`:
\`\`\`
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
\`\`\`

## Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS 3.4.x
- **Animaciones**: Framer Motion
- **Base de datos**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Autenticación**: Sesiones con cookies HTTP-only
- **Seguridad**: bcryptjs para hash de contraseñas
- **APIs Externas**: Google Maps API (Distance Matrix, Geocoding)
- **Utilidades**: date-fns para manejo de fechas

## Arquitectura de Componentes

El proyecto sigue una arquitectura modular donde cada módulo (vehículos, rutas, usuarios) está separado en:

1. **Types** (`types/`): Definiciones de TypeScript centralizadas
2. **Hooks** (`hooks/`): Lógica de datos reutilizable
3. **Components** (`components/`): Componentes visuales separados (3-5 por módulo)
4. **API Routes** (`app/api/`): Endpoints REST para CRUD
5. **Pages** (`app/dashboard/`): Páginas que integran todo

Esta estructura facilita el mantenimiento, testing y escalabilidad del sistema.
