export interface ReporteConductor {
  id: string
  nombre: string
  apellido: string
  ci: string
  licencia: string
  categoria: string
  vencimientoLicencia: string
  telefono: string
  direccion: string
  documentosCompletos: boolean
  licenciaVencida: boolean
  licenciaProxVencer: boolean
  diasParaVencer: number
  viajesTotales: number
  horasTrabajadas: number
  rutaMasRecorrida: string
  ultimoViaje: string
  estado: "activo" | "inactivo"
}

export interface ReporteRuta {
  id: string
  nombre: string
  origen: string
  destino: string
  estado: string
  distanciaKm: number
  duracionMinutos: number
  fechaSalida: string
  fechaLlegadaEstimada: string
  vehiculoId: string
  vehiculoPlaca: string
  conductorId: string
  conductorNombre: string
  tiempoRealMinutos?: number
  variacionTiempo?: number
}

export interface ReporteGPS {
  dispositivo_id: string
  imei: string
  vehiculo_placa: string
  ubicacionActual: {
    latitud: number
    longitud: number
    timestamp: string
  }
  velocidadPromedio: number
  velocidadMaxima: number
  frenadas: number
  tiempoEncendido: number
  consumoEstimado: number
  alertas: {
    excesoVelocidad: boolean
    combustibleBajo: boolean
    gpsDesconectado: boolean
    fueraDeRuta: boolean
  }
}

export interface ReporteVehiculo {
  id: string
  placa: string
  marca: string
  tipoVehiculo: string
  estado: string
  gpsActivo: boolean
  documentosVigentes: boolean
  soatVencimiento: string
  itvVencimiento: string
  permisoVencimiento: string
  viajesMes: number
  distanciaRecorrida: number
  ultimoGPS: string
  conductorActual?: string
}

export interface ReporteConfig {
  tipo: "conductores" | "rutas" | "gps" | "vehiculos"
  fechaInicio?: string
  fechaFin?: string
  filtros?: Record<string, any>
}
