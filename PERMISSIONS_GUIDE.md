# Sistema de Permisos - Guía de Uso

## 📋 Descripción General

Tu sistema de permisos ya está completamente implementado y funcional. Se organiza en:

1. **Configuración de permisos** (`lib/permissions.ts`) - Definición centralizada
2. **Utilidades** (`lib/permission-utils.ts`) - Funciones de validación
3. **Componentes** (`components/permission-guard.tsx`) - UI para proteger contenido
4. **Auth Context** (`lib/auth-context.tsx`) - Ya incluye `hasPermission()`

---

## 🚀 Primeros Pasos

### 1️⃣ Generar los roles predefinidos

```bash
npm run db:seed
```

Esto crea automáticamente 5 roles:
- **admin**: Acceso total al sistema
- **supervisor**: Supervisión y reportes
- **operador**: Gestión de viajes y conductores
- **conductor**: Visualización de asignaciones
- **mecanico**: Gestión de mantenimiento

### 2️⃣ Asignar un rol a un usuario

En la base de datos o a través de la UI:

```sql
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') WHERE email = 'admin@example.com';
```

---

## 📖 Cómo Usar

### En Componentes (Frontend)

#### Opción 1: Componente `PermissionGuard`

```tsx
import { PermissionGuard } from "@/components/permission-guard"
import { PERMISSIONS } from "@/lib/permissions"

export function MiComponente() {
  return (
    <PermissionGuard permission={PERMISSIONS.CONDUCTORES_EDIT}>
      {/* Solo se muestra si el usuario tiene permiso */}
      <button>Editar Conductor</button>
    </PermissionGuard>
  )
}
```

#### Opción 2: Hook `useAuth`

```tsx
import { useAuth } from "@/lib/auth-context"
import { PERMISSIONS } from "@/lib/permissions"

export function MiComponente() {
  const { user, hasPermission } = useAuth()

  if (!hasPermission(PERMISSIONS.CONDUCTORES_EDIT)) {
    return <p>No tienes permiso</p>
  }

  return <button>Editar Conductor</button>
}
```

#### Opciones avanzadas: Múltiples permisos

```tsx
{/* El usuario debe tener AL MENOS UNO de estos permisos */}
<PermissionGuard permission={[PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT]}>
  <button>Gestionar Usuarios</button>
</PermissionGuard>
```

---

### En Endpoints de API

Ya está implementado en `/api/conductores/route.ts`. Para otros endpoints, sigue este patrón:

```typescript
import { type NextRequest, NextResponse } from "next/server"
import { checkPermissionAPI, notAuthenticated, permissionDenied } from "@/lib/permission-utils"
import { PERMISSIONS } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  // Verificar autenticación y permisos
  const authCheck = await checkPermissionAPI(request, PERMISSIONS.VEHICULOS_VIEW)

  if (!authCheck.allowed) {
    return authCheck.error === "No autenticado"
      ? notAuthenticated()
      : permissionDenied("No tienes permiso para ver vehículos")
  }

  // ... tu código aquí ...
}
```

---

## 📚 Lista de Permisos Disponibles

### Dashboard
- `PERMISSIONS.DASHBOARD_VIEW` - Ver dashboard

### Conductores
- `PERMISSIONS.CONDUCTORES_VIEW` - Ver conductores
- `PERMISSIONS.CONDUCTORES_CREATE` - Crear conductores
- `PERMISSIONS.CONDUCTORES_EDIT` - Editar conductores
- `PERMISSIONS.CONDUCTORES_DELETE` - Eliminar conductores
- `PERMISSIONS.CONDUCTORES_EXPORT` - Exportar conductores

### Vehículos
- `PERMISSIONS.VEHICULOS_VIEW` - Ver vehículos
- `PERMISSIONS.VEHICULOS_CREATE` - Crear vehículos
- `PERMISSIONS.VEHICULOS_EDIT` - Editar vehículos
- `PERMISSIONS.VEHICULOS_DELETE` - Eliminar vehículos
- `PERMISSIONS.VEHICULOS_EXPORT` - Exportar vehículos

### Rutas
- `PERMISSIONS.RUTAS_VIEW` - Ver rutas
- `PERMISSIONS.RUTAS_CREATE` - Crear rutas
- `PERMISSIONS.RUTAS_EDIT` - Editar rutas
- `PERMISSIONS.RUTAS_DELETE` - Eliminar rutas
- `PERMISSIONS.RUTAS_EXPORT` - Exportar rutas

### Viajes
- `PERMISSIONS.VIAJES_VIEW` - Ver viajes
- `PERMISSIONS.VIAJES_CREATE` - Crear viajes
- `PERMISSIONS.VIAJES_EDIT` - Editar viajes
- `PERMISSIONS.VIAJES_DELETE` - Eliminar viajes
- `PERMISSIONS.VIAJES_IN_TRANSIT_VIEW` - Ver viajes en tránsito
- `PERMISSIONS.VIAJES_EXPORT` - Exportar viajes

### Mantenimiento
- `PERMISSIONS.MANTENIMIENTO_VIEW` - Ver mantenimiento
- `PERMISSIONS.MANTENIMIENTO_CREATE` - Crear registros
- `PERMISSIONS.MANTENIMIENTO_EDIT` - Editar registros
- `PERMISSIONS.MANTENIMIENTO_DELETE` - Eliminar registros
- `PERMISSIONS.MANTENIMIENTO_EXPORT` - Exportar registros

### GPS
- `PERMISSIONS.GPS_TRACKING_VIEW` - Ver rastreo GPS
- `PERMISSIONS.GPS_TRACKING_REALTIME` - Ver GPS en tiempo real
- `PERMISSIONS.GPS_TRACKING_HISTORY` - Ver historial GPS
- `PERMISSIONS.DISPOSITIVOS_GPS_VIEW` - Ver dispositivos GPS
- `PERMISSIONS.DISPOSITIVOS_GPS_CREATE` - Crear dispositivos
- `PERMISSIONS.DISPOSITIVOS_GPS_EDIT` - Editar dispositivos
- `PERMISSIONS.DISPOSITIVOS_GPS_DELETE` - Eliminar dispositivos

### Documentos
- `PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW` - Ver documentos
- `PERMISSIONS.DOCUMENTOS_CONDUCTOR_UPLOAD` - Subir documentos
- `PERMISSIONS.DOCUMENTOS_CONDUCTOR_DELETE` - Eliminar documentos

### Reportes
- `PERMISSIONS.REPORTES_VIEW` - Ver reportes
- `PERMISSIONS.REPORTES_CONDUCTORES` - Reportes de conductores
- `PERMISSIONS.REPORTES_VEHICULOS` - Reportes de vehículos
- `PERMISSIONS.REPORTES_RUTAS` - Reportes de rutas
- `PERMISSIONS.REPORTES_GPS` - Reportes GPS
- `PERMISSIONS.REPORTES_EXPORT` - Exportar reportes

### Configuración
- `PERMISSIONS.SETTINGS_VIEW` - Ver configuración
- `PERMISSIONS.SETTINGS_EDIT` - Editar configuración

### Usuarios y Roles
- `PERMISSIONS.USERS_VIEW` - Ver usuarios
- `PERMISSIONS.USERS_CREATE` - Crear usuarios
- `PERMISSIONS.USERS_EDIT` - Editar usuarios
- `PERMISSIONS.USERS_DELETE` - Eliminar usuarios
- `PERMISSIONS.USERS_ROLES_MANAGE` - Gestionar roles de usuarios
- `PERMISSIONS.ROLES_VIEW` - Ver roles
- `PERMISSIONS.ROLES_CREATE` - Crear roles
- `PERMISSIONS.ROLES_EDIT` - Editar roles
- `PERMISSIONS.ROLES_DELETE` - Eliminar roles

---

## 🔧 Personalizar Permisos

### Agregar un nuevo permiso

1. Edita `lib/permissions.ts`:

```typescript
export const PERMISSIONS = {
  // ... permisos existentes ...
  MI_NUEVO_PERMISO: "mi.modulo.permiso",
}
```

2. Asignalo a roles en `DEFAULT_ROLES`:

```typescript
export const DEFAULT_ROLES = {
  SUPERVISOR: {
    permissions: [
      // ... otros permisos ...
      PERMISSIONS.MI_NUEVO_PERMISO,
    ],
  },
}
```

3. Re-ejecuta el seed:

```bash
npm run db:seed
```

### Crear un rol personalizado (vía UI)

1. Ve a `/dashboard/users-roles`
2. Haz clic en "Nuevo Rol"
3. Ingresa el nombre, descripción y selecciona permisos
4. Guarda

---

## 🛡️ Protección de Rutas

El middleware (`middleware.ts`) ya valida automáticamente:

✅ Autenticación en `/dashboard/*`  
✅ Permisos en rutas específicas  
✅ Redirección a login si no está autenticado  
✅ Redirección al dashboard si no tiene permisos  

---

## 🧪 Pruebas

### 1. Crear un usuario admin

```bash
# Opcionalmente vía API/UI
```

### 2. Probar permisos en componentes

```tsx
<PermissionGuard permission={PERMISSIONS.CONDUCTORES_CREATE}>
  <p>✅ Este texto solo aparece para usuarios con permiso</p>
</PermissionGuard>
```

### 3. Probar permisos en API

```bash
curl -H "Cookie: session_token=..." http://localhost:3000/api/conductores
```

---

## ⚠️ Notas Importantes

1. **El middleware es asincrónico** - Las redirecciones por permisos pueden tener un pequeño delay
2. **Siempre valida en el servidor** - El frontend solo es decorativo
3. **Los permisos se cargan en cada request** - No se cachean en el cliente
4. **Admin siempre tiene todos los permisos** - Incluso si agregas nuevos permisos

---

## 📝 Próximos Pasos

✅ **Hecho**: Sistema base implementado  
📌 **Recomendado**: Agregar permisos a otros endpoints (`/api/vehiculos`, `/api/viajes`, etc.)  
📌 **Recomendado**: Agregar validación de permisos a más componentes  
📌 **Opcional**: Crear página de "Acceso Denegado" personalizada  

---

¡Tu sistema de permisos está listo! 🎉
