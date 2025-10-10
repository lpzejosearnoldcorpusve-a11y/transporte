export interface Mantenimiento {
  id: string
  vehiculoId: string
  fechaInicio: Date
  fechaFin: Date | null
  estado: EstadoMantenimiento
  nombreTaller: string | null
  contactoTaller: string | null
  descripcionProblema: string | null
  trabajosRealizados: string | null
  partesInteriores: string[] | null
  partesExteriores: string[] | null
  costoTotal: string | null
  moneda: string | null
  fichasUrls: string[] | null
  datosOcr: string | null
  registradoPor: string | null
  creadoEn: Date
  actualizadoEn: Date | null
}

export interface MantenimientoFormData {
  vehiculoId: string
  fechaInicio: Date
  nombreTaller?: string
  contactoTaller?: string
  descripcionProblema?: string
}

export interface MantenimientoCompletarData {
  fechaFin: Date
  trabajosRealizados: string
  partesInteriores: string[]
  partesExteriores: string[]
  costoTotal?: number
  fichasUrls: string[]
  datosOcr?: any
}

export type EstadoMantenimiento = "en_proceso" | "completado"

export interface VehiculoConMantenimiento {
  id: string
  placa: string
  marca: string
  tipoVehiculo: string | null
  estado: string | null
  imagen?: string
  mantenimientoActivo?: Mantenimiento
}

export interface DatosOCR {
  vehiculo?: {
    placa?: string
    marca?: string
    modelo?: string
    color?: string
  }
  trabajos?: string[]
  partes?: {
    interiores?: string[]
    exteriores?: string[]
  }
  costo?: number
  fecha?: string
}
