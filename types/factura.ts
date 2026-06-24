export interface Factura {
  id: string
  numeroFactura?: string | null
  fechaFactura: Date | string
  proveedor?: string | null
  categoria: string
  archivoUrl: string
  archivoNombre: string
  archivoTipo: string
  estado: string
  errorMensaje?: string | null
  datosOcr?: Record<string, any> | null
  cloudinaryPublicId?: string | null
  creadoEn: Date | string
  actualizadoEn?: Date | string | null
  conductorId?: string | null
  gastoId?: string | null
  vehiculoId?: string | null
  viajeId?: string | null
}

export interface FacturaFormData {
  numeroFactura?: string
  fechaFactura: string
  proveedor?: string
  categoria: string
  archivoUrl: string
  archivoNombre: string
  archivoTipo: string
  estado?: string
  conductorId?: string
  gastoId?: string
  vehiculoId?: string
  viajeId?: string
  datosOcr?: Record<string, any> | null
}

export interface CreateFacturaData extends FacturaFormData {}
export interface UpdateFacturaData extends Partial<FacturaFormData> {}
