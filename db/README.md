# Base de Datos - Drizzle ORM con Neon

Esta carpeta contiene toda la configuración de la base de datos usando Drizzle ORM y Neon PostgreSQL.

## Estructura

- `schema.ts` - Define las tablas y relaciones de la base de datos
- `index.ts` - Exporta la instancia de Drizzle configurada
- `migrate.ts` - Script para ejecutar migraciones

## Tablas

### roles
- Almacena los roles del sistema (admin, operador, supervisor, etc.)
- Incluye permisos como array de texto

### users
- Usuarios del sistema
- Contraseñas hasheadas con bcrypt
- Referencia a roles
- Control de usuarios activos/inactivos

### user_sessions
- Sesiones de usuario activas
- Tokens de autenticación
- Información de user agent e IP
- Expiración automática

## Comandos disponibles

\`\`\`bash
# Generar migraciones basadas en cambios en schema.ts
npm run db:generate

# Ejecutar migraciones pendientes
npm run db:migrate

# Abrir Drizzle Studio (interfaz visual)
npm run db:studio
\`\`\`

## Configuración

1. Copia `.env.example` a `.env.local`
2. Agrega tu `DATABASE_URL` de Neon
3. Ejecuta `npm run db:generate` para generar migraciones
4. Ejecuta `npm run db:migrate` para aplicar las migraciones
