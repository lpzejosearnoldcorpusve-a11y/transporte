This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Sistema de Transporte de Hidrocarburos

Sistema de gestión para empresas de transporte de hidrocarburos construido con Next.js, Tailwind CSS 3.4.x, Drizzle ORM y Neon Database.

├── app/                      # Rutas principales de Next.js
│   ├── api/                  # API Routes (Backend)
│   │   ├── auth/             # Autenticación (login, logout, me, seed)
│   │   ├── users/            # CRUD de usuarios
│   │   └── roles/            # CRUD de roles
│   ├── dashboard/            # Sección del panel administrativo
│   │   ├── users-roles/      # Gestión de usuarios y roles
│   │   └── settings/         # Configuración general
│   ├── layout.tsx            # Layout principal (con AuthProvider)
│   ├── page.tsx              # Página de login / acceso
│   └── globals.css           # Estilos globales
│
├── components/               # Componentes reutilizables
│   ├── animations/           # Animaciones (WelcomeAnimation, etc.)
│   ├── common/               # Elementos comunes (Logo, UserMenu)
│   ├── forms/                # Formularios (LoginForm)
│   ├── layouts/              # Layouts (DashboardLayout)
│   ├── navigation/           # Sidebar, Header, Menús
│   ├── pages/                # Contenido específico de páginas
│   ├── users-roles/          # Componentes de usuarios y roles
│   └── ui/                   # Componentes UI básicos (botones, cards)
│
├── db/                       # Base de datos (Drizzle ORM)
│   ├── schema.ts             # Definición de esquemas (users, roles, sessions)
│   ├── index.ts              # Conexión e inicialización de la DB
│   └── migrate.ts            # Scripts de migración
│
├── lib/                      # Librerías y utilidades
│   ├── auth.ts               # Funciones de autenticación (login, JWT)
│   └── auth-context.tsx      # Contexto global de autenticación
│
├── middleware.ts             # Middleware de protección de rutas
│
└── public/
    └── assets/               # Imágenes y logos del proyecto

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

Agrega tu `DATABASE_URL` de Neon en `.env.local`:
\`\`\`
DATABASE_URL=postgresql://user:password@host/database
\`\`\`

3. Ejecuta las migraciones de la base de datos:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

4. (Opcional) Crea datos de prueba:
\`\`\`bash
# Llama a la API de seed desde tu navegador o con curl:
curl -X POST http://localhost:3000/api/auth/seed
\`\`\`

Esto creará dos usuarios de prueba:
- **Admin**: admin@empresa.com / admin123
- **Operador**: operador@empresa.com / operador123

5. Coloca tu logo en `public/assets/` y actualiza `components/common/logo.tsx`

6. Ejecuta el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Características

- ✅ Sistema de autenticación completo con sesiones
- ✅ Animación de bienvenida futurista con Framer Motion
- ✅ Gestión de usuarios y roles con CRUD completo
- ✅ Sistema de permisos basado en roles
- ✅ Protección de rutas con middleware
- ✅ Dashboard con navegación vertical
- ✅ Base de datos con Drizzle ORM y Neon
- ✅ Componentes modulares y reutilizables
- ✅ Tailwind CSS 3.4.x
- ✅ Next.js 15 (estable)
- ✅ Diseño responsive

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
2. Ingresa tus credenciales
3. Disfruta de la animación de bienvenida
4. Serás redirigido al dashboard

### Gestionar Usuarios y Roles
1. Ve a "Usuarios y Roles" en el sidebar
2. Usa las pestañas para alternar entre usuarios y roles
3. Crea, edita o elimina usuarios y roles según sea necesario

## Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS 3.4.x
- **Animaciones**: Framer Motion
- **Base de datos**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Autenticación**: Sesiones con cookies HTTP-only
- **Seguridad**: bcryptjs para hash de contraseñas
