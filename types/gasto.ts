export interface Gasto {
  id: string
  tipoGasto: string
  monto: number
  moneda: string
  descripcion?: string | null
  fecha: Date | string
  referenciaFactura?: string | null
  imagenComprobanteUrl?: string | null
  creadoEn: Date | string
  viajeId?: string | null
}

export interface GastoFormData {
  tipoGasto: string
  monto: number
  moneda: string
  descripcion?: string
  fecha: string
  referenciaFactura?: string
  imagenComprobanteUrl?: string
  viajeId?: string
}

export interface CreateGastoData extends GastoFormData {}
export interface UpdateGastoData extends Partial<GastoFormData> {}
