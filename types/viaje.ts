export type Viaje = {
  id: string
  vehiculoId: string
  conductorId: string
  rutaId: string
  numeroViaje: string
  numeroFactura?: string | null
  producto: string
  cantidad: number
  unidad: string
  lugarCarga: string
  lugarDescarga: string
  lugarCargaLat?: number | null
  lugarCargaLng?: number | null
  lugarDescargaLat?: number | null
  lugarDescargaLng?: number | null
  fechaInicio: Date
  horaInicio?: string | null
  fechaFin?: Date | null
  horaFin?: string | null
  fechaEstimadaLlegada?: Date | null
  estado: "planificado" | "en_transito" | "completado" | "cancelado"
  observaciones?: string | null
  referencia?: string | null
  codigoQr?: string | null
  urlHojaRuta?: string | null
  creadoEn: Date
  actualizadoEn?: Date | null
  creadoPor?: string | null
}

export type CreateViajeInput = {
  vehiculoId: string
  conductorId: string
  rutaId: string 
  numeroViaje: string
  numeroFactura?: string
  producto: string
  cantidad: number
  unidad?: string
  lugarCarga: string 
  lugarDescarga: string 
  fechaInicio: Date
  horaInicio?: string
  fechaEstimadaLlegada?: Date
  observaciones?: string
  referencia?: string
}

export type UpdateViajeInput = Partial<CreateViajeInput>