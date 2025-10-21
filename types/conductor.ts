export interface Conductor {
  id: string
  nombre: string
  apellido: string
  ci: string
  licencia: string
  categoria: string
  vencimientoLicencia: Date | string
  telefono?: string | null
  direccion?: string | null
  creadoEn: Date | string
  actualizadoEn?: Date | string | null
}

export interface ConductorFormData {
  nombre: string
  apellido: string
  ci: string
  licencia: string
  categoria: string
  vencimientoLicencia: string
  telefono?: string
  direccion?: string
}

export interface CreateConductorData extends ConductorFormData {}
export interface UpdateConductorData extends Partial<ConductorFormData> {}
