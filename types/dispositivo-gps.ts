export interface DispositivoGps {
  id: string
  imei: string
  modelo: string | null
  fabricante: string | null
  numeroSerie: string | null
  vehiculoId: string | null
  estado: string
  conectado: boolean
  ultimaSenal: Date | null
  ultimaLatitud: string | null
  ultimaLongitud: string | null
  intervaloReporte: string
  alertaVelocidad: string | null
  alertaCombustible: string | null
  fechaInstalacion: Date | null
  fechaActivacion: Date | null
  observaciones: string | null
  creadoEn: Date
  actualizadoEn: Date | null
}

export interface DispositivoConVehiculo extends DispositivoGps {
  vehiculo?: {
    id: string
    placa: string
    marca: string
  }
}

export interface DispositivoFormData {
  imei: string
  modelo?: string
  fabricante?: string
  numeroSerie?: string
  intervaloReporte?: number
  alertaVelocidad?: number
  alertaCombustible?: number
  observaciones?: string
}


export interface VincularVehiculoData {
  imei: string;           
  vehiculoId: string;
  fechaInstalacion?: Date;
}

export type EstadoDispositivo = "activo" | "inactivo" | "mantenimiento"