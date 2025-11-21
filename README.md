# Sistema de Transporte de Hidrocarburos

Sistema completo de gestión para empresas de transporte de hidrocarburos construido con Next.js 15, React 19, TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL, y múltiples integraciones.

## 🏗️ Estructura Completa del Proyecto

```
transpore-app/
├── app/                           # App Router de Next.js 15
│   ├── api/                      # API Routes (REST)
│   │   ├── auth/                # ✅ Autenticación (login, logout, me, seed)
│   │   ├── dashboard/           # ✅ Dashboard APIs (estadísticas, KPIs)
│   │   ├── users/              # ✅ CRUD de usuarios
│   │   ├── roles/              # ✅ CRUD de roles  
│   │   ├── vehiculos/          # ✅ CRUD de vehículos
│   │   │   └── tracking/       # ✅ Tracking GPS en tiempo real
│   │   ├── rutas/              # ✅ CRUD de rutas con OpenStreetMap
│   │   ├── mantenimientos/     # ✅ CRUD de mantenimientos
│   │   ├── conductores/        # ✅ CRUD de conductores
│   │   ├── documentos-conductor/ # ✅ CRUD de documentos
│   │   ├── dispositivos-gps/   # ✅ CRUD de dispositivos GPS
│   │   ├── gps/                # ✅ GPS tracking data
│   │   ├── viajes/             # ✅ CRUD de viajes
│   │   ├── viajes-en-transito/ # ✅ Viajes activos dashboard
│   │   ├── reportes/           # 🆕 Sistema completo de reportes
│   │   │   ├── conductores/    # ✅ Reportes de conductores
│   │   │   ├── rutas/          # ✅ Reportes de rutas
│   │   │   ├── gps/            # ✅ Reportes GPS tracking
│   │   │   ├── vehiculos/      # ✅ Reportes de vehículos
│   │   │   ├── generar-pdf/    # ✅ Generador PDF profesional
│   │   │   └── generar-lote/   # 🆕 Generación masiva (hasta 10 PDFs)
│   │   └── upload/             # ✅ Subida de archivos
│   ├── dashboard/               # Páginas del dashboard
│   │   ├── page.tsx            # ✅ Dashboard principal con KPIs
│   │   ├── layout.tsx          # ✅ Layout del dashboard
│   │   ├── users-roles/        # ✅ Gestión de usuarios y roles
│   │   ├── vehiculos/          # ✅ Gestión de vehículos
│   │   ├── rutas/              # ✅ Gestión de rutas
│   │   ├── viajes/             # ✅ Gestión de viajes
│   │   ├── conductores/        # ✅ Gestión de conductores
│   │   ├── documentos-conductor/ # ✅ Gestión de documentos
│   │   ├── mantenimiento/      # ✅ Gestión de mantenimientos
│   │   ├── dispositivos-gps/   # ✅ Gestión de dispositivos GPS
│   │   ├── gps-tracking/       # ✅ GPS Tracking en tiempo real
│   │   ├── reportes/           # 🆕 Sistema completo de reportes
│   │   └── settings/           # ✅ Configuraciones
│   ├── layout.tsx              # ✅ Layout principal con AuthProvider
│   ├── page.tsx                # ✅ Página de login con animación
│   └── globals.css             # ✅ Estilos globales + custom colors
│
├── components/                  # Componentes React modulares
│   ├── animations/             # ✅ Animaciones con Framer Motion
│   │   └── welcome-animation.tsx # ✅ Animación futurista de login
│   ├── common/                 # ✅ Componentes comunes
│   │   ├── logo.tsx           # ✅ Logo personalizable
│   │   └── user-menu.tsx      # ✅ Menú de usuario
│   ├── dashboard/              # 🆕 Componentes del dashboard
│   │   ├── dashboard-content.tsx # ✅ Contenido principal con SWR
│   │   ├── dashboard-stats.tsx   # ✅ Estadísticas y KPIs
│   │   └── dashboard-charts.tsx  # ✅ Gráficos y métricas
│   ├── forms/                  # ✅ Formularios
│   │   └── login-form.tsx     # ✅ Formulario de login
│   ├── layouts/                # ✅ Layouts
│   │   └── dashboard-layout.tsx # ✅ Layout principal del dashboard
│   ├── navigation/             # ✅ Navegación
│   │   ├── sidebar.tsx        # ✅ Sidebar con navegación
│   │   └── header.tsx         # ✅ Header del dashboard
│   ├── pages/                  # ✅ Contenido de páginas específicas
│   │   └── dashboard-content.tsx # ✅ Contenido del dashboard
│   ├── users-roles/            # ✅ Usuarios y roles (4 componentes)
│   ├── vehiculos/              # ✅ Vehículos (6 componentes)
│   ├── rutas/                  # ✅ Rutas (6 componentes + mapa)
│   ├── mantenimiento/          # ✅ Mantenimientos (8 componentes)
│   ├── conductores/            # ✅ Conductores (5 componentes)
│   ├── documentos-conductor/   # ✅ Documentos (6 componentes)
│   ├── viajes/                 # ✅ Viajes (7 componentes + PDF/QR)
│   ├── gps-tracking/           # ✅ GPS Tracking (6 componentes + mapa)
│   ├── dispositivos-gps/       # ✅ Dispositivos GPS (6 componentes)
│   ├── reportes/               # 🆕 Sistema completo de reportes
│   │   ├── reportes-header.tsx           # ✅ Header con botones de descarga
│   │   ├── reporte-filtros.tsx           # ✅ Filtros universales
│   │   ├── reporte-conductores-tabla.tsx # ✅ Tabla de conductores
│   │   ├── reporte-conductores-estadisticas.tsx # ✅ KPIs conductores
│   │   ├── reporte-rutas-tabla.tsx       # ✅ Tabla de rutas
│   │   ├── reporte-rutas-estadisticas.tsx # ✅ KPIs rutas
│   │   ├── reporte-gps-tabla.tsx         # ✅ Tabla GPS tracking
│   │   ├── reporte-gps-estadisticas.tsx  # ✅ KPIs GPS
│   │   ├── reporte-vehiculos-tabla.tsx   # ✅ Tabla de vehículos
│   │   ├── reporte-vehiculos-estadisticas.tsx # ✅ KPIs vehículos
│   │   └── bulk-report-generator.tsx     # 🆕 Generador masivo
│   └── ui/                     # ✅ Componentes base (shadcn/ui)
│
├── hooks/                      # Hooks personalizados con SWR
│   ├── use-toast.ts           # ✅ Notificaciones
│   ├── use-vehiculos.ts       # ✅ Hook para vehículos
│   ├── use-vehiculo-mutations.ts # ✅ CRUD vehículos
│   ├── use-rutas.ts           # ✅ Hook para rutas
│   ├── use-ruta-mutations.ts  # ✅ CRUD rutas
│   ├── use-mantenimientos.ts  # ✅ Hook para mantenimientos
│   ├── use-mantenimiento-mutations.ts # ✅ CRUD mantenimientos
│   ├── use-conductores.ts     # ✅ Hook para conductores
│   ├── use-conductor-mutations.ts # ✅ CRUD conductores
│   ├── use-documentos-conductor.ts # ✅ Hook para documentos
│   ├── use-documento-conductor-mutations.ts # ✅ CRUD documentos
│   ├── use-viajes.ts          # ✅ Hook para viajes
│   ├── use-viaje-mutations.ts # ✅ CRUD viajes
│   ├── use-dispositivos-gps.ts # ✅ Hook para dispositivos GPS
│   ├── use-dispositivo-gps-mutations.ts # ✅ CRUD dispositivos
│   ├── use-gps-tracking.ts    # ✅ Hook para GPS tracking
│   ├── use-reportes-conductores.ts # 🆕 Hook reportes conductores
│   ├── use-reportes-rutas.ts      # 🆕 Hook reportes rutas
│   ├── use-reportes-gps.ts        # 🆕 Hook reportes GPS
│   └── use-reportes-vehiculos.ts  # 🆕 Hook reportes vehículos
│
├── lib/                       # Librerías y utilidades
│   ├── auth.ts               # ✅ Autenticación con sesiones
│   ├── auth-context.tsx      # ✅ Context de autenticación
│   ├── utils.ts              # ✅ Utilidades generales
│   ├── google-maps.ts        # ✅ Google Maps API (opcional)
│   ├── openstreetmap.ts      # 🆕 OpenStreetMap integración
│   ├── cloudinary.ts         # ✅ Cloudinary para archivos
│   ├── ocr-service.ts        # ✅ OCR para mantenimientos
│   └── reportes-utils.ts     # 🆕 Utilidades para reportes
│
├── types/                     # Tipos TypeScript
│   ├── vehiculo.ts           # ✅ Tipos de vehículos
│   ├── ruta.ts               # ✅ Tipos de rutas
│   ├── mantenimiento.ts      # ✅ Tipos de mantenimientos
│   ├── conductor.ts          # ✅ Tipos de conductores
│   ├── documento-conductor.ts # ✅ Tipos de documentos
│   ├── dispositivo-gps.ts    # ✅ Tipos de dispositivos GPS
│   ├── gps-tracking.ts       # ✅ Tipos de GPS tracking
│   ├── viaje.ts              # ✅ Tipos de viajes
│   └── reportes.ts           # 🆕 Tipos para todos los reportes
│
├── db/                        # Base de datos con Drizzle ORM
│   ├── schema.ts             # ✅ Esquemas completos (11 tablas)
│   ├── index.ts              # ✅ Conexión PostgreSQL
│   ├── migrate.ts            # ✅ Script de migración
│   └── README.md             # ✅ Documentación DB
│
├── drizzle/                   # Migraciones generadas
│   ├── 0000_*.sql            # ✅ Migraciones incrementales
│   └── meta/                 # ✅ Metadata de migraciones
│
├── public/
│   └── assets/               # ✅ Logos, imágenes
│
├── middleware.ts             # ✅ Protección de rutas
├── drizzle.config.ts         # ✅ Configuración Drizzle
├── next.config.ts            # ✅ Configuración Next.js 15
├── tailwind.config.js        # ✅ Colores personalizados
├── postcss.config.js         # ✅ PostCSS
├── tsconfig.json             # ✅ TypeScript config
└── package.json              # ✅ Dependencias completas
```

## 🎨 Colores Corporativos

- **Verde Oscuro**: `#144230` (forest-green-900) - Color principal
- **Naranja Vibrante**: `#f97316` (vibrant-orange-500) - Acentos y CTAs  
- **Blanco**: `#ffffff` - Fondos y texto

## 🚀 Instalación y Configuración
│   ├── use-toast.ts        # Hook de notificaciones
1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```

Configurar `.env.local`:
```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://user:password@host/database

# Google Maps (opcional, para geocodificación alternativa)
GOOGLE_MAPS_API_KEY=tu_api_key_opcional

# Cloudinary (para almacenamiento de documentos)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_seguro
```

3. **Configurar base de datos:**
```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Ver base de datos (opcional)
npm run db:studio
```

4. **Crear usuario administrador:**
```bash
# Ejecutar seed desde el navegador o curl:
curl -X POST http://localhost:3000/api/auth/seed
```

**Credenciales por defecto:**
- **Email:** admin@gmail.com  
- **Password:** hola1234

5. **Iniciar desarrollo:**
```bash
npm run dev
```

6. **Construir para producción:**
```bash
npm run build
npm run start
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción  
npm run start        # Servidor de producción
npm run db:generate  # Generar migraciones Drizzle
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Drizzle Studio (GUI)
npm run db:push      # Sincronizar esquema
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## ✨ Características Principales

### 🔐 Sistema de Autenticación Completo
- ✅ **Login seguro** con sesiones HTTP-only cookies
- ✅ **Animación futurista** de bienvenida con Framer Motion
- ✅ **Sistema de roles y permisos** granular
- ✅ **Protección de rutas** con middleware automático
- ✅ **Seed de usuario administrador** incluido

### 👥 Gestión de Usuarios y Roles
- ✅ **CRUD completo** de usuarios y roles
- ✅ **Asignación de permisos** por rol
- ✅ **Interface intuitiva** con tabs y formularios
- ✅ **Validaciones** completas en frontend y backend

### 🚛 Gestión Integral de Vehículos  
- ✅ **CRUD completo** con documentación (SOAT, ITV, permisos)
- ✅ **Estados automáticos**: activo, mantenimiento, inactivo, averiado
- ✅ **Alertas de vencimiento** de documentos con notificaciones
- ✅ **Integración GPS** para tracking en tiempo real
- ✅ **Historial completo** de mantenimientos y servicios

### 🔧 Sistema de Mantenimiento Avanzado
- ✅ **CRUD completo** con subida de fichas múltiples
- ✅ **OCR automático** para extracción de datos de PDFs
- ✅ **Registro detallado** de partes interiores/exteriores cambiadas
- ✅ **Galería multimedia** con previsualizador integrado
- ✅ **Validación obligatoria** de fichas antes de completar
- ✅ **8 componentes modulares** con animaciones fluidas
- ✅ **Cambio automático** de estado del vehículo

### 👨‍💼 Gestión de Conductores y Documentación
- ✅ **CRUD completo** de conductores (datos, CI, licencia, categoría)
- ✅ **Control de vencimientos** de licencias con alertas
- ✅ **Sistema de documentación** con almacenamiento en Cloudinary
- ✅ **Múltiples formatos** de archivo soportados (PDF, JPG, PNG, etc.)
- ✅ **Generador de contratos** con firma digital
- ✅ **Sistema de validación** y fiscalización de documentos
- ✅ **Visor integrado** para todos los tipos de documentos

### 🗺️ Gestión de Rutas con OpenStreetMap
- ✅ **Integración completa** con OpenStreetMap (gratuito)
- ✅ **Mapas interactivos** con Leaflet centrados en Bolivia
- ✅ **Cálculo automático** de distancia y duración con OSRM
- ✅ **Geocodificación** de direcciones con Nominatim
- ✅ **Rutas reales** por carreteras (no líneas rectas)
- ✅ **Mapas estáticos** para previsualización
- ✅ **Selector de ubicación** interactivo con clic en mapa
- ✅ **Asignación de vehículos** y estados de ruta

### 🚚 Gestión Avanzada de Viajes
- ✅ **CRUD completo** con asignación de vehículos y conductores
- ✅ **Registro de productos** y cantidades transportadas
- ✅ **Lugares de carga y descarga** detallados
- ✅ **Generación automática** de hoja de ruta en PDF
- ✅ **Códigos QR** escaneables que abren rutas en OpenStreetMap
- ✅ **Información completa** de vehículo y conductor en PDF
- ✅ **Vista dual**: tabla detallada y cuadrícula visual
- ✅ **Animaciones fluidas** con Framer Motion

### 📡 GPS Tracking en Tiempo Real
- ✅ **CRUD completo** de dispositivos GPS con IMEI
- ✅ **Tabla de dispositivos** activos con estado en vivo  
- ✅ **Actualización automática** cada 3-5 segundos
- ✅ **Mapa interactivo** con marcadores animados de vehículos
- ✅ **Panel lateral** con información detallada en tiempo real
- ✅ **Estadísticas completas**: velocidad, altitud, satélites
- ✅ **Historial de posiciones** con timestamps
- ✅ **Sistema de vinculación** vehículo-dispositivo automático
- ✅ **6 componentes modulares** especializados

### 📊 Sistema Completo de Reportes (NUEVO)
- 🆕 **4 tipos de reportes**: Conductores, Rutas, GPS, Vehículos
- 🆕 **Generación de PDFs profesionales** con diseño corporativo
- 🆕 **Estadísticas avanzadas** con KPIs y métricas visuales
- 🆕 **Tablas interactivas** con filtros y ordenamiento
- 🆕 **Generación masiva** de hasta 10 reportes simultáneos
- 🆕 **Sistema de progreso** en tiempo real para lotes
- 🆕 **Descarga automática** de PDFs generados
- 🆕 **Manejo de errores** graceful con reportes consolidados

#### Reportes Disponibles:
1. **🧑‍💼 Reportes de Conductores**
   - Estado de licencias y vencimientos
   - Información de contacto y datos personales
   - Estadísticas de documentación vigente

2. **🛣️ Reportes de Rutas** 
   - Análisis de distancias y tiempos
   - Estados de rutas (activas, completadas, canceladas)
   - Asignación de vehículos y eficiencia

3. **📡 Reportes GPS Tracking**
   - Estado de conectividad de dispositivos
   - Alertas de velocidad, combustible, conexión
   - Ubicaciones actuales y estadísticas de movimiento

4. **🚛 Reportes de Vehículos**
   - Estado operativo de la flota
   - Vencimientos de documentación (SOAT, ITV)
   - Rendimiento y estadísticas de viajes

### 🎨 Dashboard Inteligente con Analytics
- ✅ **KPIs en tiempo real** con SWR (sin GraphQL)
- ✅ **Gráficos interactivos** de estadísticas operativas
- ✅ **Métricas de flota**: vehículos activos, en mantenimiento
- ✅ **Estado de viajes**: en tránsito, completados
- ✅ **Alertas de documentos** próximos a vencer
- ✅ **Conectividad GPS** y dispositivos en línea

## 🛠️ Stack Tecnológico

### Frontend
- **⚛️ Next.js 15** (App Router estable)
- **⚛️ React 19** con Server Components
- **📘 TypeScript** para type safety completo
- **🎨 Tailwind CSS 3.4.x** con colores personalizados
- **✨ Framer Motion** para animaciones fluidas
- **🎨 shadcn/ui** componentes base elegantes

### Backend & Base de Datos  
- **🐘 PostgreSQL** con Neon Database
- **🗃️ Drizzle ORM** type-safe con migraciones
- **🔐 Autenticación** con sesiones HTTP-only cookies
- **🔒 bcryptjs** para hash seguro de contraseñas

### Integraciones de Mapas (Gratuitas)
- **🗺️ OpenStreetMap** + **Leaflet** para mapas interactivos
- **🛣️ OSRM** para cálculo de rutas por carreteras reales  
- **📍 Nominatim** para geocodificación de direcciones
- **🗺️ StaticMap** para imágenes de mapas en PDFs

### Almacenamiento y Archivos
- **☁️ Cloudinary** para documentos y archivos multimedia
- **📄 jsPDF** para generación de PDFs profesionales  
- **📱 qrcode.react** para códigos QR en documentos
- **🔍 OCR automático** para extracción de datos

### Utilidades y Datos
- **🔄 SWR** para fetching eficiente con cache
- **📅 date-fns** para manejo de fechas
- **🎯 Lucide React** para iconografía consistente
- **📊 React PDF** para visualización de documentos

## 🏗️ Arquitectura de Componentes

### Principios de Diseño
1. **Modularidad**: Cada funcionalidad es un módulo independiente
2. **Reutilización**: Componentes base compartidos entre módulos  
3. **Separación**: Hooks para lógica, componentes para UI
4. **Type Safety**: TypeScript en toda la aplicación
5. **Performance**: SWR para cache inteligente de datos

### Estructura Modular
Cada módulo funcional contiene:
- **📁 Types** (`types/`): Definiciones TypeScript centralizadas
- **🪝 Hooks** (`hooks/`): Lógica de datos reutilizable con SWR
- **🧩 Components** (`components/`): Componentes visuales especializados
- **🛣️ API Routes** (`app/api/`): Endpoints REST para CRUD
- **📄 Pages** (`app/dashboard/`): Páginas que integran funcionalidades

### Módulos Completos Implementados

| Módulo | Componentes | Hooks | APIs | Estado |
|--------|-------------|-------|------|--------|
| **🔐 Autenticación** | 3 | 1 | 4 | ✅ Completo |
| **👥 Usuarios/Roles** | 4 | 2 | 2 | ✅ Completo |
| **🚛 Vehículos** | 6 | 2 | 2 | ✅ Completo |
| **🔧 Mantenimiento** | 8 | 2 | 1 | ✅ Completo |
| **👨‍💼 Conductores** | 5 | 2 | 1 | ✅ Completo |
| **📄 Documentos** | 6 | 2 | 1 | ✅ Completo |
| **🛣️ Rutas** | 6 | 2 | 1 | ✅ Completo |
| **🚚 Viajes** | 7 | 2 | 2 | ✅ Completo |
| **📡 GPS Tracking** | 6 | 3 | 2 | ✅ Completo |
| **📱 Dispositivos GPS** | 6 | 2 | 1 | ✅ Completo |
| **📊 Reportes** | 11 | 4 | 6 | 🆕 Completo |
| **📈 Dashboard** | 3 | 0 | 3 | ✅ Completo |

**Total**: 71 componentes, 24 hooks, 26 APIs

## 📋 Guía de Uso Completa
### 🚀 Inicio Rápido

#### 1. **Acceso al Sistema**
1. Navegar a `http://localhost:3000`
2. Usar credenciales: `admin@gmail.com` / `hola1234`
3. Disfrutar de la animación futurista de bienvenida
4. Acceder al dashboard principal con métricas en tiempo real

#### 2. **Dashboard Principal**
- **📊 KPIs en tiempo real**: Vehículos activos, viajes en curso, alertas
- **📈 Gráficos dinámicos**: Estado de flota, documentos por vencer
- **⚠️ Alertas importantes**: Mantenimientos pendientes, GPS desconectados
- **🔄 Actualización automática** cada 30 segundos con SWR

### 👥 Gestión de Usuarios y Roles
1. **Ir a "Usuarios y Roles"** en el sidebar
2. **Crear roles** con permisos específicos
3. **Gestionar usuarios** y asignar roles
4. **Control granular** de accesos por módulo

### 🚛 Gestión de Vehículos
1. **Ir a "Vehículos"** en el sidebar
2. **Registrar vehículo** con documentación completa
3. **Sistema de alertas automático** para documentos por vencer
4. **Cambio de estado** a mantenimiento activa workflow
5. **Integración GPS** para tracking en tiempo real

### 🔧 Sistema de Mantenimiento
1. **Ir a "Mantenimiento"** en el sidebar  
2. **Seleccionar vehículo** del grid visual animado
3. **Subir fichas** (PDF, imágenes) - múltiples archivos
4. **OCR automático** extrae datos de PDFs
5. **Registrar cambios** de partes interiores/exteriores
6. **Validar y fiscalizar** antes de completar
7. **Estado automático** del vehículo vuelve a "activo"

### 👨‍💼 Gestión de Conductores
1. **Ir a "Conductores"** en el sidebar
2. **Registro completo**: datos personales, CI, licencia, categoría
3. **Control automático** de vencimiento de licencias
4. **Gestión de documentación** en módulo separado

### 📄 Gestión de Documentos
1. **Ir a "Documentación"** (submódulo de Conductores)
2. **Seleccionar conductor** del listado
3. **Subir documentos** (carnet, licencia, contratos, etc.)
4. **Almacenamiento seguro** en Cloudinary
5. **Generar contratos** con firma digital integrada
6. **Visualizar documentos** con visor integrado

### 🛣️ Gestión de Rutas
1. **Ir a "Rutas"** en el sidebar
2. **Crear ruta** e ingresar datos básicos
3. **Seleccionar origen** → se abre mapa interactivo de Bolivia
4. **Clic en mapa** para definir punto de origen
5. **Seleccionar destino** → repetir proceso
6. **Cálculo automático** de distancia y tiempo por carreteras reales
7. **Asignación de vehículo** y estado de ruta
8. **Mapa estático** generado automáticamente para previsualización

### 🚚 Gestión de Viajes  
1. **Ir a "Viajes"** en el sidebar
2. **Crear viaje** con vehículo, conductor, producto
3. **Definir lugares** de carga y descarga
4. **Generación automática** de hoja de ruta PDF
5. **Descarga de PDF** con código QR integrado  
6. **Escaneo de QR** abre ruta en OpenStreetMap
7. **Vista dual**: tabla detallada o cuadrícula visual

### 📡 GPS Tracking en Tiempo Real
1. **Ir a "GPS Tracking"** en el sidebar
2. **Visualización en mapa** de todos los vehículos activos
3. **Panel lateral** con lista de vehículos conectados
4. **Clic en vehículo** para ver información detallada
5. **Datos en tiempo real**: velocidad, altitud, satélites, timestamp
6. **Actualización automática** cada 3-5 segundos
7. **Historial de posiciones** con tracking completo

### 📱 Gestión de Dispositivos GPS
1. **Ir a "Dispositivos GPS"** en el sidebar
2. **Grid visual** de dispositivos con estado en tiempo real
3. **Crear dispositivo** ingresando IMEI único
4. **Vinculación automática** con vehículos registrados
5. **Configuración de alertas** y intervalos de reporte
6. **Monitoreo de conectividad** con indicadores visuales
7. **Recepción de datos**: coordenadas, altitud, satélites

### 📊 Sistema Completo de Reportes (NUEVO)

#### Reportes Individuales:
1. **Ir a "Reportes"** en el sidebar  
2. **Seleccionar tipo**: Conductores, Rutas, GPS, o Vehículos
3. **Aplicar filtros** según necesidades
4. **Ver estadísticas** con KPIs y métricas visuales
5. **Revisar tabla** con datos detallados
6. **Descargar PDF profesional** con un clic

#### Tipos de Reportes Disponibles:

**🧑‍💼 Reportes de Conductores:**
- Estado de licencias y días para vencer
- Información completa de contacto
- Estadísticas de documentación vigente
- Análisis de cumplimiento normativo

**🛣️ Reportes de Rutas:**
- Análisis de distancias y tiempos de viaje
- Estados: activas, completadas, canceladas
- Eficiencia de asignación de vehículos
- Tasa de éxito y rendimiento operativo

**📡 Reportes GPS Tracking:**
- Estado de conectividad de dispositivos en tiempo real
- Alertas: exceso velocidad, combustible bajo, GPS desconectado
- Estadísticas de movimiento y ubicaciones
- Análisis de cobertura de flota

**🚛 Reportes de Vehículos:**
- Estado operativo completo de la flota
- Control de vencimientos (SOAT, ITV, permisos)
- Estadísticas de viajes y rendimiento
- Alertas de documentación próxima a vencer

#### Generación Masiva de Reportes:
1. **Clic en "Generar Lote"** en header de reportes
2. **Seleccionar tipos** de reportes (hasta 10 simultáneos)
3. **Configurar opciones**: incluir estadísticas consolidadas
4. **Iniciar generación** con indicador de progreso
5. **Descarga automática** de todos los PDFs exitosos
6. **Reporte consolidado** con resumen de la operación

#### Características de los PDFs:
- **🎨 Diseño profesional** con branding corporativo
- **📊 Tablas organizadas** con datos estructurados  
- **📈 Headers informativos** con fecha y metadatos
- **🔢 Estadísticas incluidas** en cada reporte
- **📄 Paginación automática** para grandes volúmenes
- **🎯 Formato consistente** entre todos los tipos

## 🌍 Integración con OpenStreetMap (Gratuito)

El sistema utiliza servicios gratuitos de mapas sin restricciones:

### Servicios Utilizados:
- **🗺️ Leaflet**: Mapas interactivos responsivos
- **📍 Nominatim**: Geocodificación de direcciones bolivianas
- **🛣️ OSRM**: Cálculo de rutas por carreteras reales
- **🗺️ StaticMap**: Generación de imágenes para PDFs

### Ventajas:
- ✅ **Sin costo** - Completamente gratuito
- ✅ **Sin API keys** requeridas
- ✅ **Sin límites** de uso  
- ✅ **Centrado en Bolivia** con datos locales precisos
- ✅ **Rutas realistas** siguiendo carreteras existentes
- ✅ **Actualizaciones constantes** de la comunidad

## ☁️ Integración con Cloudinary

### Configuración:
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key  
CLOUDINARY_API_SECRET=tu_api_secret
```

### Capacidades:
- **📁 Almacenamiento multimedia**: PDF, JPG, PNG, DOC, etc.
- **🔄 Optimización automática** de archivos
- **🌐 CDN global** para acceso rápido
- **🗑️ Eliminación automática** al borrar registros
- **🔒 Acceso controlado** con URLs seguras
- **📊 Analytics de uso** de archivos

## 🗃️ Base de Datos - Schema Completo

### 📋 Tablas Implementadas (11 total):

1. **👤 users** - Usuarios del sistema
2. **🏷️ roles** - Roles y permisos  
3. **🔑 sessions** - Sesiones de autenticación
4. **🚛 vehiculos** - Registro de vehículos
5. **🛣️ rutas** - Rutas de transporte
6. **🔧 mantenimientos** - Registros de mantenimiento
7. **👨‍💼 conductores** - Información de conductores
8. **📄 documentosConductor** - Documentos digitales
9. **🚚 viajes** - Registros de viajes
10. **📱 dispositivosGps** - Dispositivos GPS
11. **📡 gpsTracking** - Datos de tracking en tiempo real

### 🔄 Migraciones:
- **Auto-generadas** con Drizzle ORM
- **Incrementales** y versionadas
- **Rollback seguro** disponible
- **Schema validation** automática

## ⚡ Performance y Optimización

### Frontend:
- **⚡ Next.js 15** con App Router optimizado
- **🔄 SWR** para cache inteligente de datos
- **🎯 Code splitting** automático por rutas
- **🖼️ Image optimization** con next/image
- **📱 Progressive Web App** ready

### Backend:
- **🏃‍♂️ API Routes** optimizadas con caching
- **🔍 Database indexing** en campos críticos  
- **📊 Query optimization** con Drizzle ORM
- **🔄 Connection pooling** automático
- **📈 Monitoring** incluido

### UX/UI:
- **✨ Animaciones fluidas** con Framer Motion
- **📱 Responsive design** completo
- **♿ Accessibility** siguiendo WCAG
- **🎨 Design system** consistente
- **⚡ Loading states** optimizados

## 🚀 Despliegue en Producción

### Requerimientos Mínimos:
- **Node.js** 18+ (recomendado 20+)
- **PostgreSQL** 14+ 
- **Memory**: 1GB RAM mínimo
- **Storage**: 10GB (crecimiento según archivos)

### Plataformas Recomendadas:
1. **Vercel** (recomendado para Next.js)
2. **Railway** (full-stack con PostgreSQL) 
3. **Heroku** (clásico, fácil setup)
4. **DigitalOcean App Platform**
5. **AWS Amplify** (escalable)

### Variables de Entorno Producción:
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:password@host/database
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=secreto_ultra_seguro_64_chars_min
CLOUDINARY_CLOUD_NAME=produccion_cloud
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret
```

### Checklist Pre-Deploy:
- ✅ Variables de entorno configuradas
- ✅ Base de datos migrada (`npm run db:migrate`)
- ✅ Usuario administrador creado
- ✅ Cloudinary configurado
- ✅ Build exitoso (`npm run build`)
- ✅ Tests pasando (si implementados)

## 📈 Próximas Características

### En Desarrollo:
- 🔔 **Sistema de notificaciones** push
- 📊 **Analytics avanzados** con dashboards personalizables  
- 🤖 **IA para predicción** de mantenimientos
- 📱 **App móvil** React Native
- 🔄 **API pública** para integraciones

### Roadmap 2024:
- ⚡ **Real-time updates** con WebSockets
- 🌐 **Multi-tenancy** para múltiples empresas
- 🔐 **SSO integration** (Google, Microsoft)
- 📋 **Workflow engine** configurable
- 🎯 **Advanced reporting** con BI

## 🤝 Contribución y Desarrollo

### Setup de Desarrollo:
```bash
# Clonar repositorio
git clone <repo-url>
cd transpore-app

# Instalar dependencias
npm install

# Setup entorno
cp .env.example .env.local

# Configurar DB
npm run db:migrate
npm run db:seed

# Desarrollo
npm run dev
```

### Estructura para Nuevos Módulos:
```
nuevo-modulo/
├── types/nuevo-modulo.ts           # Tipos TypeScript
├── hooks/
│   ├── use-nuevo-modulo.ts         # Hook de lectura
│   └── use-nuevo-modulo-mutations.ts # Hook de escritura
├── components/nuevo-modulo/
│   ├── nuevo-modulo-tabla.tsx      # Componente tabla
│   ├── nuevo-modulo-formulario.tsx # Formulario
│   └── nuevo-modulo-card.tsx       # Visualización
├── app/api/nuevo-modulo/
│   └── route.ts                    # API endpoints
└── app/dashboard/nuevo-modulo/
    └── page.tsx                    # Página principal
```

## 📞 Soporte y Documentación

### Recursos:
- 📚 **Documentación completa** en `/docs`
- 🎯 **Guías de API** en `/docs/api`  
- 🧑‍💻 **Ejemplos de código** en `/examples`
- 🐛 **Issue tracking** en GitHub
- 💬 **Discussions** para preguntas

### Stack de Tecnologías Actualizado:

| Categoría | Tecnología | Versión | Estado |
|-----------|------------|---------|--------|
| **Framework** | Next.js | 15.x | ✅ Estable |
| **React** | React | 19.x | ✅ Última |
| **Styling** | Tailwind CSS | 3.4.x | ✅ Optimizado |
| **TypeScript** | TypeScript | 5.x | ✅ Completo |
| **Database** | PostgreSQL | 14+ | ✅ Producción |
| **ORM** | Drizzle | Latest | ✅ Type-safe |
| **Auth** | Custom Sessions | - | ✅ Seguro |
| **Storage** | Cloudinary | API v1 | ✅ Integrado |
| **Maps** | OpenStreetMap | - | ✅ Gratuito |
| **UI** | shadcn/ui | Latest | ✅ Moderno |
| **Animation** | Framer Motion | 11.x | ✅ Fluido |

---

**🏢 Sistema desarrollado para empresas de transporte de hidrocarburos**  
**🚛 Gestión completa de flota, personal, rutas y operaciones**  
**📊 Con sistema de reportes profesionales y generación masiva**  
**⚡ Optimizado para rendimiento y escalabilidad empresarial**

