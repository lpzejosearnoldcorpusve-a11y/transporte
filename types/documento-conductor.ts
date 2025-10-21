export interface DocumentoConductor {
  id: string
  conductorId: string
  tipoDocumento: TipoDocumento
  nombreArchivo: string
  urlArchivo: string
  tipoArchivo: string
  tamanoBytes: string | null
  validado: boolean
  validadoPor: string | null
  fechaValidacion: Date | null
  observacionesValidacion: string | null
  descripcion: string | null
  fechaEmision: Date | null
  fechaVencimiento: Date | null
  subidoPor: string | null
  creadoEn: Date
  actualizadoEn: Date | null
}

export type TipoDocumento = "carnet_identidad" | "licencia_conducir" | "croquis_casa" | "contrato" | "firma" | "otro"

export interface DocumentoConductorFormData {
  conductorId: string
  tipoDocumento: TipoDocumento
  descripcion?: string
  fechaEmision?: Date
  fechaVencimiento?: Date
  archivo: File
}

export interface ContratoData {
  conductorId: string
  nombreCompleto: string
  ci: string
  direccion: string
  telefono: string
  licencia: string
  categoria: string
  fechaInicio: Date
  fechaFin: Date
  salario: number
  observaciones?: string
}

export const TIPOS_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  carnet_identidad: "Carnet de Identidad",
  licencia_conducir: "Licencia de Conducir",
  croquis_casa: "Croquis de Casa",
  contrato: "Contrato",
  firma: "Firma",
  otro: "Otro",
}
