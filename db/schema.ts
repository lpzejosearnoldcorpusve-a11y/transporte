import { pgTable, text, timestamp, boolean, numeric } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Tabla de roles
export const roles = pgTable("roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(), // admin, operador, supervisor, etc.
  description: text("description"),
  permissions: text("permissions").array(), // array de permisos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})

// Tabla de usuarios
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(), // siempre hasheado con bcrypt
  roleId: text("role_id").references(() => roles.id),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  active: boolean("active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
})

// Tabla de sesiones
export const userSessions = pgTable("user_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  active: boolean("active").default(true).notNull(),
  userAgent: text("user_agent"),
  ip: text("ip"),
})

// Tabla de vehículos
export const vehiculos = pgTable("vehiculos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  placa: text("placa").notNull().unique(),
  marca: text("marca").notNull(), // Marca y modelo juntos
  anio: numeric("anio"),
  tipoVehiculo: text("tipo_vehiculo").default("cisterna"),
  capacidadLitros: numeric("capacidad_litros"),
  combustible: text("combustible").default("diésel"),
  chasis: text("chasis"),

  nroSoat: text("nro_soat"),
  vencSoat: timestamp("venc_soat"),
  nroItv: text("nro_itv"),
  vencItv: timestamp("venc_itv"),
  nroPermiso: text("nro_permiso"),
  vencPermiso: timestamp("venc_permiso"),

  // Campos GPS (ahora aceptan NULL)
  gpsId: text("gps_id"),
  gpsActivo: boolean("gps_activo"),

  estado: text("estado").default("activo"),

  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tabla de rutas
export const rutas = pgTable("rutas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  nombre: text("nombre").notNull(),
  vehiculoId: text("vehiculo_id").references(() => vehiculos.id),

  // Origen y destino
  origen: text("origen").notNull(),
  origenLat: numeric("origen_lat"),
  origenLng: numeric("origen_lng"),

  destino: text("destino").notNull(),
  destinoLat: numeric("destino_lat"),
  destinoLng: numeric("destino_lng"),

  // Datos de Google Maps
  distanciaKm: numeric("distancia_km"),
  duracionMinutos: numeric("duracion_minutos"),

  // Fechas planificadas
  fechaSalida: timestamp("fecha_salida"),
  fechaLlegadaEstimada: timestamp("fecha_llegada_estimada"),

  // Estado de la ruta
  estado: text("estado").default("planificada"), // planificada, en_curso, completada, cancelada

  // Seguimiento
  inicioReal: timestamp("inicio_real"),
  finReal: timestamp("fin_real"),

  // Observaciones
  observaciones: text("observaciones"),

  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tabla de mantenimientos
export const mantenimientos = pgTable("mantenimientos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  vehiculoId: text("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),

  // Fechas
  fechaInicio: timestamp("fecha_inicio").notNull(),
  fechaFin: timestamp("fecha_fin"),

  // Estado del mantenimiento
  estado: text("estado").default("en_proceso"), // en_proceso, completado

  // Datos del taller/mecánico
  nombreTaller: text("nombre_taller"),
  contactoTaller: text("contacto_taller"),

  // Descripción general
  descripcionProblema: text("descripcion_problema"),
  trabajosRealizados: text("trabajos_realizados"),

  // Partes cambiadas (JSON)
  partesInteriores: text("partes_interiores").array(),
  partesExteriores: text("partes_exteriores").array(),

  // Costos
  costoTotal: numeric("costo_total"),
  moneda: text("moneda").default("PEN"),

  // Fichas de mantenimiento (imágenes)
  fichasUrls: text("fichas_urls").array(), // URLs de las imágenes subidas

  // Datos extraídos por OCR (JSON)
  datosOcr: text("datos_ocr"), // JSON string con datos extraídos

  // Usuario que registró
  registradoPor: text("registrado_por").references(() => users.id),

  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tabla de conductores
export const conductores = pgTable("conductores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  ci: text("ci").notNull().unique(), // Cédula de identidad
  licencia: text("licencia").notNull(),
  categoria: text("categoria").notNull(), // A, B, C, etc.
  vencimientoLicencia: timestamp("vencimiento_licencia").notNull(),
  telefono: text("telefono"),
  direccion: text("direccion"),

  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tabla de documentos de conductor
export const documentosConductor = pgTable("documentos_conductor", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  conductorId: text("conductor_id")
    .references(() => conductores.id, { onDelete: "cascade" })
    .notNull(),

  // Tipo de documento
  tipoDocumento: text("tipo_documento").notNull(), // carnet_identidad, licencia_conducir, croquis_casa, contrato, firma, otro

  // Información del archivo
  nombreArchivo: text("nombre_archivo").notNull(),
  urlArchivo: text("url_archivo").notNull(),
  tipoArchivo: text("tipo_archivo").notNull(), // image/jpeg, application/pdf, etc.
  tamanoBytes: numeric("tamano_bytes"),

  // Estado de validación
  validado: boolean("validado").default(false),
  validadoPor: text("validado_por").references(() => users.id),
  fechaValidacion: timestamp("fecha_validacion"),
  observacionesValidacion: text("observaciones_validacion"),

  // Metadatos adicionales
  descripcion: text("descripcion"),
  fechaEmision: timestamp("fecha_emision"),
  fechaVencimiento: timestamp("fecha_vencimiento"),

  // Auditoría
  subidoPor: text("subido_por").references(() => users.id),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tabla de tracking GPS
export const gpsTracking = pgTable("gps_tracking", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  vehiculoId: text("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),

  // Datos GPS
  latitud: numeric("latitud").notNull(),
  longitud: numeric("longitud").notNull(),
  altitud: numeric("altitud"), // en metros
  satelites: numeric("satelites"), // número de satélites
  velocidad: numeric("velocidad"), // km/h
  direccion: numeric("direccion"), // grados (0-360)

  // Estado del vehículo
  estadoMotor: text("estado_motor").default("encendido"), // encendido, apagado
  nivelCombustible: numeric("nivel_combustible"), // porcentaje

  // Timestamp
  timestamp: timestamp("timestamp").defaultNow().notNull(),

  // Metadatos
  precision: numeric("precision"), // precisión en metros
  proveedor: text("proveedor").default("gps"), // gps, network, etc.
})

// Tabla de dispositivos GPS
export const dispositivosGps = pgTable("dispositivos_gps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  // Identificación del dispositivo
  imei: text("imei").notNull().unique(), // Identificador único del dispositivo
  modelo: text("modelo"),
  fabricante: text("fabricante"),
  numeroSerie: text("numero_serie"),

  // Vinculación con vehículo
  vehiculoId: text("vehiculo_id").references(() => vehiculos.id),

  // Estado del dispositivo
  estado: text("estado").default("activo"), // activo, inactivo, mantenimiento
  conectado: boolean("conectado").default(false),

  // Última comunicación
  ultimaSenal: timestamp("ultima_senal"),
  ultimaLatitud: numeric("ultima_latitud"),
  ultimaLongitud: numeric("ultima_longitud"),

  // Configuración
  intervaloReporte: numeric("intervalo_reporte").default("30"), // segundos
  alertaVelocidad: numeric("alerta_velocidad"), // km/h
  alertaCombustible: numeric("alerta_combustible"), // porcentaje

  // Metadatos
  fechaInstalacion: timestamp("fecha_instalacion"),
  fechaActivacion: timestamp("fecha_activacion"),
  observaciones: text("observaciones"),

  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").$onUpdate(() => new Date()),
})

// Tipos TypeScript inferidos
export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type UserSession = typeof userSessions.$inferSelect
export type NewUserSession = typeof userSessions.$inferInsert

export type Vehiculo = typeof vehiculos.$inferSelect
export type NewVehiculo = typeof vehiculos.$inferInsert

export type Ruta = typeof rutas.$inferSelect
export type NewRuta = typeof rutas.$inferInsert

export type Mantenimiento = typeof mantenimientos.$inferSelect
export type NewMantenimiento = typeof mantenimientos.$inferInsert

export type Conductor = typeof conductores.$inferSelect
export type NewConductor = typeof conductores.$inferInsert

export type DocumentoConductor = typeof documentosConductor.$inferSelect
export type NewDocumentoConductor = typeof documentosConductor.$inferInsert

export type GpsTracking = typeof gpsTracking.$inferSelect
export type NewGpsTracking = typeof gpsTracking.$inferInsert

export type DispositivoGps = typeof dispositivosGps.$inferSelect
export type NewDispositivoGps = typeof dispositivosGps.$inferInsert
