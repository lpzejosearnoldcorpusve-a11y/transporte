export interface GpsPosition {
  id: string
  vehiculoId: string
  latitud: number
  longitud: number
  altitud?: number
  satelites?: number
  velocidad?: number
  direccion?: number
  estadoMotor?: "encendido" | "apagado"
  nivelCombustible?: number
  timestamp: Date
  precision?: number
  proveedor?: string
}


export interface GpsDeviceData {
  latitud: number
  longitud: number
  satelites: number
  altitud: number
  vehiculoId?: string
  velocidad?: number
  direccion?: number
  timestamp?: string
}

export interface TrackingStats {
  totalVehiculos: number
  vehiculosActivos: number
  vehiculosInactivos: number
  distanciaTotal: number
  velocidadPromedio: number
}
export type VehiculoTracking = {
  vehiculo: {
    id: string
    placa: string
    marca: string
  }
  posicion: {
    latitud: number
    longitud: number
    velocidad?: number
    altitud?: number
    satelites?: number
    timestamp: string
  }, 
  ultimaPosicion: GpsPosition
  historial: GpsPosition[]
}
