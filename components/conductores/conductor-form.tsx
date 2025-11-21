"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Conductor, ConductorFormData } from "@/types/conductor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Configuraciones estáticas
const CATEGORIAS_LICENCIA = ["A", "B", "C"]
const EXTENSIONES_CI = ["LP", "SC", "CB", "OR", "PT", "TJ", "CH", "BE", "PD"]

interface ConductorFormProps {
  conductor?: Conductor | null
  onSubmit: (data: ConductorFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function ConductorForm({ conductor, onSubmit, onCancel, loading }: ConductorFormProps) {
  const [localState, setLocalState] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ciNumero: "",
    ciExtension: "LP",
    licencia: "",
    categoria: "",
    vencimientoLicencia: "",
    telefono: "",
    zona: "",
    calle: "",
    casa: ""
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  useEffect(() => {
    if (conductor) {
      const apellidos = conductor.apellido.split(" ")
      const ciParts = conductor.ci.split("-")
      const rawDir = conductor.direccion || ""
      
      setLocalState({
        nombre: conductor.nombre,
        apellidoPaterno: apellidos[0] || "",
        apellidoMaterno: apellidos.slice(1).join(" ") || "",
        ciNumero: ciParts[0] || conductor.ci,
        ciExtension: ciParts[1] || "LP",
        licencia: conductor.licencia,
        categoria: conductor.categoria,
        vencimientoLicencia: conductor.vencimientoLicencia
          ? new Date(conductor.vencimientoLicencia).toISOString().split("T")[0]
          : "",
        telefono: conductor.telefono || "",
        zona: "",
        calle: rawDir, 
        casa: ""
      })
    }
  }, [conductor])
  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    if (!localState.nombre.trim()) {
        newErrors.nombre = "El nombre es obligatorio."
        isValid = false
    }
    if (!localState.apellidoPaterno.trim()) {
        newErrors.apellidoPaterno = "El apellido paterno es obligatorio."
        isValid = false
    }
    if (!localState.ciNumero.trim()) {
        newErrors.ciNumero = "El CI es obligatorio."
        isValid = false
    } else if (!/^\d+$/.test(localState.ciNumero)) {
        newErrors.ciNumero = "El CI solo debe contener números."
        isValid = false
    }
    if (!localState.licencia.trim()) {
        newErrors.licencia = "El Nro. de licencia es obligatorio."
        isValid = false
    }
    if (!localState.categoria) {
        newErrors.categoria = "Seleccione una categoría."
        isValid = false
    }
    
    if (!localState.vencimientoLicencia) {
        newErrors.vencimientoLicencia = "La fecha es obligatoria."
        isValid = false
    } else {
        const fechaVencimiento = new Date(localState.vencimientoLicencia)
        const hoy = new Date()
        hoy.setHours(0,0,0,0)
        if (fechaVencimiento < hoy) {
             newErrors.vencimientoLicencia = "¡Atención! Esta licencia ya está vencida."
        }
    }

    if (!localState.zona.trim()) {
        newErrors.zona = "La zona es obligatoria (Requisito 1FN)."
        isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    const apellidoCompleto = `${localState.apellidoPaterno} ${localState.apellidoMaterno}`.trim()
    const ciCompleto = `${localState.ciNumero}-${localState.ciExtension}`
    const direccionCompleta = `Zona: ${localState.zona}, Calle: ${localState.calle}, #: ${localState.casa}`

    onSubmit({
        nombre: localState.nombre,
        apellido: apellidoCompleto,
        ci: ciCompleto,
        licencia: localState.licencia,
        categoria: localState.categoria,
        vencimientoLicencia: localState.vencimientoLicencia,
        telefono: localState.telefono,
        direccion: direccionCompleta
    })
  }
  const getInputClass = (field: string) => {
      return errors[field] 
        ? "border-red-500 focus-visible:ring-red-500 bg-red-50" 
        : "focus-visible:ring-green-500 border-green-200"
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-green-100 overflow-hidden">
        <div className="bg-green-800 p-4 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
                 Registro de Conductor
                <span className="text-xs bg-green-600 px-2 py-1 rounded text-green-100 font-normal">
                  
                </span>
            </h2>
            <p className="text-green-200 text-xs mt-1">Complete todos los campos requeridos para el sistema de transporte.</p>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECCIÓN: DATOS PERSONALES */}
            <div className="space-y-4">
                <h3 className="text-green-800 font-semibold text-sm border-b border-green-100 pb-2">
                    1. Datos Personales
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="nombre" className="text-green-900">Nombres *</Label>
                        <Input
                            id="nombre"
                            value={localState.nombre}
                            onChange={(e) => setLocalState({ ...localState, nombre: e.target.value })}
                            className={getInputClass("nombre")}
                            placeholder="Nombres completos"
                        />
                        {errors.nombre && <span className="text-xs text-red-500">{errors.nombre}</span>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="paterno" className="text-green-900">Ap. Paterno *</Label>
                            <Input
                                id="paterno"
                                value={localState.apellidoPaterno}
                                onChange={(e) => setLocalState({ ...localState, apellidoPaterno: e.target.value })}
                                className={getInputClass("apellidoPaterno")}
                                placeholder="Apellido Paterno"
                            />
                            {errors.apellidoPaterno && <span className="text-xs text-red-500">{errors.apellidoPaterno}</span>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="materno" className="text-green-900">Ap. Materno</Label>
                            <Input
                                id="materno"
                                value={localState.apellidoMaterno}
                                onChange={(e) => setLocalState({ ...localState, apellidoMaterno: e.target.value })}
                                className="focus-visible:ring-green-500 border-green-200"
                                placeholder="Apellido Materno"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: IDENTIFICACIÓN */}
            <div className="space-y-4">
                <h3 className="text-green-800 font-semibold text-sm border-b border-green-100 pb-2">
                    2. Identificación Oficial
                </h3>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8 space-y-1">
                        <Label htmlFor="ci" className="text-green-900">Cédula de Identidad *</Label>
                        <Input
                            id="ci"
                            value={localState.ciNumero}
                            onChange={(e) => setLocalState({ ...localState, ciNumero: e.target.value })}
                            className={getInputClass("ciNumero")}
                            placeholder="Solo números"
                            inputMode="numeric"
                        />
                         {errors.ciNumero && <span className="text-xs text-red-500">{errors.ciNumero}</span>}
                    </div>
                    <div className="col-span-4 space-y-1">
                        <Label htmlFor="ext" className="text-green-900">Ext.</Label>
                        <select
                            id="ext"
                            className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={localState.ciExtension}
                            onChange={(e) => setLocalState({...localState, ciExtension: e.target.value})}
                        >
                            {EXTENSIONES_CI.map(ext => (
                                <option key={ext} value={ext}>{ext}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: LICENCIA */}
            <div className="space-y-4">
                <h3 className="text-green-800 font-semibold text-sm border-b border-green-100 pb-2">
                    3. Datos de Licencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="licencia" className="text-green-900">Nro. Licencia *</Label>
                        <Input
                            id="licencia"
                            value={localState.licencia}
                            onChange={(e) => setLocalState({ ...localState, licencia: e.target.value })}
                            className={getInputClass("licencia")}
                        />
                         {errors.licencia && <span className="text-xs text-red-500">{errors.licencia}</span>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="categoria" className="text-green-900">Categoría *</Label>
                        <select
                            id="categoria"
                            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.categoria ? 'border-red-500 ring-red-500' : 'border-green-200 focus:ring-green-500'}`}
                            value={localState.categoria}
                            onChange={(e) => setLocalState({...localState, categoria: e.target.value})}
                        >
                            <option value="">Seleccionar...</option>
                            {CATEGORIAS_LICENCIA.map((cat) => (
                            <option key={cat} value={cat}>Categoría {cat}</option>
                            ))}
                        </select>
                         {errors.categoria && <span className="text-xs text-red-500">{errors.categoria}</span>}
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                        <Label htmlFor="vencimiento" className="text-green-900">Fecha de Vencimiento *</Label>
                        <Input
                            id="vencimiento"
                            type="date"
                            value={localState.vencimientoLicencia}
                            onChange={(e) => setLocalState({ ...localState, vencimientoLicencia: e.target.value })}
                            className={getInputClass("vencimientoLicencia")}
                        />
                        {errors.vencimientoLicencia && <span className="text-xs text-red-500">{errors.vencimientoLicencia}</span>}
                    </div>
                </div>
            </div>

            {/* SECCIÓN: DOMICILIO (DETALLE 1FN) */}
            <div className="space-y-4 p-4 bg-green-50 rounded-md border border-green-100">
                <h3 className="text-green-800 font-bold text-sm flex justify-between">
                    4. Domicilio 
                    <span className="text-[10px] uppercase tracking-wider bg-green-200 text-green-800 px-2 py-0.5 rounded">Requerido 1FN</span>
                </h3>
                
                <div className="space-y-1">
                    <Label htmlFor="zona" className="text-green-900 text-xs">Zona / Barrio *</Label>
                    <Input
                        id="zona"
                        value={localState.zona}
                        onChange={(e) => setLocalState({ ...localState, zona: e.target.value })}
                        className={`bg-white ${getInputClass("zona")}`}
                        placeholder="Ej: Miraflores"
                    />
                    {errors.zona && <span className="text-xs text-red-500">{errors.zona}</span>}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1">
                        <Label htmlFor="calle" className="text-green-900 text-xs">Calle / Avenida</Label>
                        <Input
                            id="calle"
                            value={localState.calle}
                            onChange={(e) => setLocalState({ ...localState, calle: e.target.value })}
                            className="bg-white focus-visible:ring-green-500 border-green-200"
                            placeholder="Nombre de vía"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="casa" className="text-green-900 text-xs">Nro.</Label>
                        <Input
                            id="casa"
                            value={localState.casa}
                            onChange={(e) => setLocalState({ ...localState, casa: e.target.value })}
                            className="bg-white focus-visible:ring-green-500 border-green-200"
                            placeholder="#"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="telefono" className="text-green-900">Teléfono de Contacto</Label>
                <Input
                id="telefono"
                type="tel"
                value={localState.telefono}
                onChange={(e) => setLocalState({ ...localState, telefono: e.target.value })}
                className="focus-visible:ring-green-500 border-green-200"
                />
            </div>

            </form>
        </div>

        {/* PIE DE PÁGINA FIJO CON BOTONES */}
        <div className="bg-gray-50 p-4 border-t border-green-100 flex justify-end gap-3">
            <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-green-600 text-green-700 hover:bg-green-50"
            >
                Cancelar
            </Button>
            <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white"
            >
                {loading ? "Guardando..." : conductor ? "Actualizar Datos" : "Registrar Conductor"}
            </Button>
        </div>
    </div>
  )
}