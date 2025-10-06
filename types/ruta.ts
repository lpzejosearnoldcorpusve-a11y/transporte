export interface Ruta {
  id: string
  nombre: string
  vehiculoId: string | null

  origen: string
  origenLat: string | null
  origenLng: string | null

  destino: string
  destinoLat: string | null
  destinoLng: string | null

  distanciaKm: string | null
  duracionMinutos: string | null

  fechaSalida: Date | null
  fechaLlegadaEstimada: Date | null

  estado: "planificada" | "en_curso" | "completada" | "cancelada"

  inicioReal: Date | null
  finReal: Date | null

  observaciones: string | null

  creadoEn: Date
  actualizadoEn: Date | null
}

export interface RutaFormData {
  nombre: string
  vehiculoId: string
  origen: string
  destino: string
  fechaSalida: string
  observaciones?: string
}

export interface GoogleMapsDistanceResponse {
  distanceKm: number
  durationMinutes: number
  origenLat: number
  origenLng: number
  destinoLat: number
  destinoLng: number
}

export type RutaEstado = "planificada" | "en_curso" | "completada" | "cancelada"
