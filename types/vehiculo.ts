export interface Vehiculo {
  id?: string
  placa: string
  marca: string
  anio?: string
  tipoVehiculo?: string
  capacidadLitros?: string
  combustible?: string
  chasis?: string
  nroSoat?: string
  vencSoat?: Date
  nroItv?: string
  vencItv?: Date
  nroPermiso?: string
  vencPermiso?: Date
  gpsId?: string
  gpsActivo?: boolean
  estado?: "activo" | "mantenimiento" | "inactivo"
  creadoEn?: Date
}
