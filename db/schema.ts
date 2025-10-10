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
