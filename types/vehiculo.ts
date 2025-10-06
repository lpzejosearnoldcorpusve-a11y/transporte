export interface Vehiculo {
  id: string
  placa: string
  marca: string
  anio: string | null
  tipoVehiculo: string | null
  capacidadLitros: string | null
  combustible: string | null
  chasis: string | null
  nroSoat: string | null
  vencSoat: Date | null
  nroItv: string | null
  vencItv: Date | null
  nroPermiso: string | null
  vencPermiso: Date | null
  gpsId: string | null
  gpsActivo: boolean | null
  estado: string | null
  creadoEn: Date
}

export interface VehiculoFormData extends Omit<Vehiculo, "id" | "creadoEn"> {
  id?: string
}

export type TipoVehiculo = "cisterna" | "camion" | "trailer"
export type TipoCombustible = "diésel" | "gasolina" | "gnv"
export type EstadoVehiculo = "activo" | "mantenimiento" | "inactivo"
