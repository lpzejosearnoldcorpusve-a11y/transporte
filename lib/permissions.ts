/**
 * Configuración centralizada de permisos del sistema
 * Agrupa los permisos por módulo y define todas las operaciones posibles
 */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",
  DASHBOARD_EXPORT: "dashboard.export",

  // Conductores
  CONDUCTORES_VIEW: "conductores.view",
  CONDUCTORES_CREATE: "conductores.create",
  CONDUCTORES_EDIT: "conductores.edit",
  CONDUCTORES_DELETE: "conductores.delete",
  CONDUCTORES_EXPORT: "conductores.export",

  // Vehículos
  VEHICULOS_VIEW: "vehiculos.view",
  VEHICULOS_CREATE: "vehiculos.create",
  VEHICULOS_EDIT: "vehiculos.edit",
  VEHICULOS_DELETE: "vehiculos.delete",
  VEHICULOS_EXPORT: "vehiculos.export",

  // Rutas
  RUTAS_VIEW: "rutas.view",
  RUTAS_CREATE: "rutas.create",
  RUTAS_EDIT: "rutas.edit",
  RUTAS_DELETE: "rutas.delete",
  RUTAS_EXPORT: "rutas.export",

  // Viajes
  VIAJES_VIEW: "viajes.view",
  VIAJES_CREATE: "viajes.create",
  VIAJES_EDIT: "viajes.edit",
  VIAJES_DELETE: "viajes.delete",
  VIAJES_EXPORT: "viajes.export",
  VIAJES_IN_TRANSIT_VIEW: "viajes.in_transit.view",

  // Mantenimiento
  MANTENIMIENTO_VIEW: "mantenimiento.view",
  MANTENIMIENTO_CREATE: "mantenimiento.create",
  MANTENIMIENTO_EDIT: "mantenimiento.edit",
  MANTENIMIENTO_DELETE: "mantenimiento.delete",
  MANTENIMIENTO_EXPORT: "mantenimiento.export",

  // GPS Tracking
  GPS_TRACKING_VIEW: "gps_tracking.view",
  GPS_TRACKING_REALTIME: "gps_tracking.realtime",
  GPS_TRACKING_HISTORY: "gps_tracking.history",

  // Dispositivos GPS
  DISPOSITIVOS_GPS_VIEW: "dispositivos_gps.view",
  DISPOSITIVOS_GPS_CREATE: "dispositivos_gps.create",
  DISPOSITIVOS_GPS_EDIT: "dispositivos_gps.edit",
  DISPOSITIVOS_GPS_DELETE: "dispositivos_gps.delete",

  // Documentos Conductor
  DOCUMENTOS_CONDUCTOR_VIEW: "documentos_conductor.view",
  DOCUMENTOS_CONDUCTOR_UPLOAD: "documentos_conductor.upload",
  DOCUMENTOS_CONDUCTOR_DELETE: "documentos_conductor.delete",

  // Reportes
  REPORTES_VIEW: "reportes.view",
  REPORTES_CONDUCTORES: "reportes.conductores",
  REPORTES_VEHICULOS: "reportes.vehiculos",
  REPORTES_RUTAS: "reportes.rutas",
  REPORTES_GPS: "reportes.gps",
  REPORTES_EXPORT: "reportes.export",

  // Configuración
  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",

  // Gastos
  GASTOS_VIEW: "gastos.view",
  GASTOS_CREATE: "gastos.create",
  GASTOS_EDIT: "gastos.edit",
  GASTOS_DELETE: "gastos.delete",
  GASTOS_EXPORT: "gastos.export",

  // Facturas
  FACTURAS_VIEW: "facturas.view",
  FACTURAS_CREATE: "facturas.create",
  FACTURAS_EDIT: "facturas.edit",
  FACTURAS_DELETE: "facturas.delete",
  FACTURAS_EXPORT: "facturas.export",

  // Usuarios y Roles
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",
  USERS_ROLES_MANAGE: "users.roles.manage",
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_EDIT: "roles.edit",
  ROLES_DELETE: "roles.delete",
} as const

/**
 * Roles predefinidos con sus permisos asociados
 */
export const DEFAULT_ROLES = {
  ADMIN: {
    name: "admin",
    description: "Administrador del sistema - acceso total",
    // Admin tiene TODOS los permisos
    permissions: Object.values(PERMISSIONS),
  },
  SUPERVISOR: {
    name: "supervisor",
    description: "Supervisor - supervisión de flota y reportes",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CONDUCTORES_VIEW,
      PERMISSIONS.CONDUCTORES_EXPORT,
      PERMISSIONS.VEHICULOS_VIEW,
      PERMISSIONS.VEHICULOS_EXPORT,
      PERMISSIONS.RUTAS_VIEW,
      PERMISSIONS.RUTAS_EXPORT,
      PERMISSIONS.VIAJES_VIEW,
      PERMISSIONS.VIAJES_EXPORT,
      PERMISSIONS.VIAJES_IN_TRANSIT_VIEW,
      PERMISSIONS.MANTENIMIENTO_VIEW,
      PERMISSIONS.MANTENIMIENTO_EXPORT,
      PERMISSIONS.GPS_TRACKING_VIEW,
      PERMISSIONS.GPS_TRACKING_REALTIME,
      PERMISSIONS.GPS_TRACKING_HISTORY,
      PERMISSIONS.DISPOSITIVOS_GPS_VIEW,
      PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
      PERMISSIONS.GASTOS_VIEW,
      PERMISSIONS.GASTOS_EXPORT,
      PERMISSIONS.FACTURAS_VIEW,
      PERMISSIONS.FACTURAS_EXPORT,
      PERMISSIONS.REPORTES_VIEW,
      PERMISSIONS.REPORTES_CONDUCTORES,
      PERMISSIONS.REPORTES_VEHICULOS,
      PERMISSIONS.REPORTES_RUTAS,
      PERMISSIONS.REPORTES_GPS,
      PERMISSIONS.REPORTES_EXPORT,
    ],
  },
  OPERADOR: {
    name: "operador",
    description: "Operador - gestión de viajes y conductores",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CONDUCTORES_VIEW,
      PERMISSIONS.CONDUCTORES_CREATE,
      PERMISSIONS.CONDUCTORES_EDIT,
      PERMISSIONS.VEHICULOS_VIEW,
      PERMISSIONS.RUTAS_VIEW,
      PERMISSIONS.RUTAS_CREATE,
      PERMISSIONS.RUTAS_EDIT,
      PERMISSIONS.VIAJES_VIEW,
      PERMISSIONS.VIAJES_CREATE,
      PERMISSIONS.VIAJES_EDIT,
      PERMISSIONS.VIAJES_IN_TRANSIT_VIEW,
      PERMISSIONS.MANTENIMIENTO_VIEW,
      PERMISSIONS.GASTOS_VIEW,
      PERMISSIONS.GASTOS_CREATE,
      PERMISSIONS.GASTOS_EDIT,
      PERMISSIONS.FACTURAS_VIEW,
      PERMISSIONS.FACTURAS_CREATE,
      PERMISSIONS.FACTURAS_EDIT,
      PERMISSIONS.GPS_TRACKING_VIEW,
      PERMISSIONS.DISPOSITIVOS_GPS_VIEW,
      PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
      PERMISSIONS.DOCUMENTOS_CONDUCTOR_UPLOAD,
    ],
  },
  CONDUCTOR: {
    name: "conductor",
    description: "Conductor - visualización de asignaciones",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.VIAJES_VIEW,
      PERMISSIONS.GPS_TRACKING_VIEW,
      PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
    ],
  },
  MECANICO: {
    name: "mecanico",
    description: "Mecánico - gestión de mantenimiento",
    permissions: [
      PERMISSIONS.VEHICULOS_VIEW,
      PERMISSIONS.MANTENIMIENTO_VIEW,
      PERMISSIONS.MANTENIMIENTO_CREATE,
      PERMISSIONS.MANTENIMIENTO_EDIT,
      PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
    ],
  },
} as const

/**
 * Rutas que requieren permisos específicos
 * Formato: ruta => permiso requerido
 */
export const ROUTE_PERMISSIONS: Record<string, string | string[]> = {
  "/dashboard": PERMISSIONS.DASHBOARD_VIEW,
  "/dashboard/conductores": PERMISSIONS.CONDUCTORES_VIEW,
  "/dashboard/vehiculos": PERMISSIONS.VEHICULOS_VIEW,
  "/dashboard/rutas": PERMISSIONS.RUTAS_VIEW,
  "/dashboard/viajes": PERMISSIONS.VIAJES_VIEW,
  "/dashboard/viajes-en-transito": PERMISSIONS.VIAJES_IN_TRANSIT_VIEW,
  "/dashboard/mantenimiento": PERMISSIONS.MANTENIMIENTO_VIEW,
  "/dashboard/gps-tracking": PERMISSIONS.GPS_TRACKING_VIEW,
  "/dashboard/dispositivos-gps": PERMISSIONS.DISPOSITIVOS_GPS_VIEW,
  "/dashboard/documentos-conductor": PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
  "/dashboard/gastos": PERMISSIONS.GASTOS_VIEW,
  "/dashboard/facturas": PERMISSIONS.FACTURAS_VIEW,
  "/dashboard/reportes": PERMISSIONS.REPORTES_VIEW,
  "/dashboard/settings": PERMISSIONS.SETTINGS_VIEW,
  "/dashboard/users-roles": PERMISSIONS.USERS_VIEW,
}

/**
 * Endpoints de API que requieren permisos específicos
 * Formato: ruta => { método => permiso }
 */
export const API_PERMISSIONS: Record<string, Record<string, string>> = {
  "/api/conductores": {
    GET: PERMISSIONS.CONDUCTORES_VIEW,
    POST: PERMISSIONS.CONDUCTORES_CREATE,
  },
  "/api/conductores/[id]": {
    GET: PERMISSIONS.CONDUCTORES_VIEW,
    PUT: PERMISSIONS.CONDUCTORES_EDIT,
    DELETE: PERMISSIONS.CONDUCTORES_DELETE,
  },
  "/api/vehiculos": {
    GET: PERMISSIONS.VEHICULOS_VIEW,
    POST: PERMISSIONS.VEHICULOS_CREATE,
  },
  "/api/vehiculos/[id]": {
    GET: PERMISSIONS.VEHICULOS_VIEW,
    PUT: PERMISSIONS.VEHICULOS_EDIT,
    DELETE: PERMISSIONS.VEHICULOS_DELETE,
  },
  "/api/rutas": {
    GET: PERMISSIONS.RUTAS_VIEW,
    POST: PERMISSIONS.RUTAS_CREATE,
  },
  "/api/rutas/[id]": {
    GET: PERMISSIONS.RUTAS_VIEW,
    PUT: PERMISSIONS.RUTAS_EDIT,
    DELETE: PERMISSIONS.RUTAS_DELETE,
  },
  "/api/viajes": {
    GET: PERMISSIONS.VIAJES_VIEW,
    POST: PERMISSIONS.VIAJES_CREATE,
  },
  "/api/viajes/[id]": {
    GET: PERMISSIONS.VIAJES_VIEW,
    PUT: PERMISSIONS.VIAJES_EDIT,
    DELETE: PERMISSIONS.VIAJES_DELETE,
  },
  "/api/viajes-en-transito": {
    GET: PERMISSIONS.VIAJES_IN_TRANSIT_VIEW,
  },
  "/api/mantenimientos": {
    GET: PERMISSIONS.MANTENIMIENTO_VIEW,
    POST: PERMISSIONS.MANTENIMIENTO_CREATE,
  },
  "/api/mantenimientos/[id]": {
    GET: PERMISSIONS.MANTENIMIENTO_VIEW,
    PUT: PERMISSIONS.MANTENIMIENTO_EDIT,
    DELETE: PERMISSIONS.MANTENIMIENTO_DELETE,
  },
  "/api/gps-tracking": {
    GET: PERMISSIONS.GPS_TRACKING_VIEW,
  },
  "/api/dispositivos-gps": {
    GET: PERMISSIONS.DISPOSITIVOS_GPS_VIEW,
    POST: PERMISSIONS.DISPOSITIVOS_GPS_CREATE,
  },
  "/api/dispositivos-gps/[id]": {
    PUT: PERMISSIONS.DISPOSITIVOS_GPS_EDIT,
    DELETE: PERMISSIONS.DISPOSITIVOS_GPS_DELETE,
  },
  "/api/documentos-conductor": {
    GET: PERMISSIONS.DOCUMENTOS_CONDUCTOR_VIEW,
    POST: PERMISSIONS.DOCUMENTOS_CONDUCTOR_UPLOAD,
  },
  "/api/documentos-conductor/[id]": {
    DELETE: PERMISSIONS.DOCUMENTOS_CONDUCTOR_DELETE,
  },
  "/api/gastos": {
    GET: PERMISSIONS.GASTOS_VIEW,
    POST: PERMISSIONS.GASTOS_CREATE,
    PUT: PERMISSIONS.GASTOS_EDIT,
    DELETE: PERMISSIONS.GASTOS_DELETE,
  },
  "/api/gastos/[id]": {
    GET: PERMISSIONS.GASTOS_VIEW,
    PUT: PERMISSIONS.GASTOS_EDIT,
    DELETE: PERMISSIONS.GASTOS_DELETE,
  },
  "/api/facturas": {
    GET: PERMISSIONS.FACTURAS_VIEW,
    POST: PERMISSIONS.FACTURAS_CREATE,
    PUT: PERMISSIONS.FACTURAS_EDIT,
    DELETE: PERMISSIONS.FACTURAS_DELETE,
  },
  "/api/facturas/[id]": {
    GET: PERMISSIONS.FACTURAS_VIEW,
    PUT: PERMISSIONS.FACTURAS_EDIT,
    DELETE: PERMISSIONS.FACTURAS_DELETE,
  },
  "/api/reportes": {
    GET: PERMISSIONS.REPORTES_VIEW,
  },
  "/api/roles": {
    GET: PERMISSIONS.ROLES_VIEW,
    POST: PERMISSIONS.ROLES_CREATE,
  },
  "/api/roles/[id]": {
    PUT: PERMISSIONS.ROLES_EDIT,
    DELETE: PERMISSIONS.ROLES_DELETE,
  },
  "/api/users": {
    GET: PERMISSIONS.USERS_VIEW,
    POST: PERMISSIONS.USERS_CREATE,
  },
  "/api/users/[id]": {
    PUT: PERMISSIONS.USERS_EDIT,
    DELETE: PERMISSIONS.USERS_DELETE,
  },
}
