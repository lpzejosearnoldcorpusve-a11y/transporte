"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VehiculoForm } from "./vehiculo-form"

interface Vehiculo {
  id?: string
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
}

interface VehiculoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculo?: Vehiculo | null
  onSave: (vehiculo: Vehiculo) => void
}

export function VehiculoFormDialog({ open, onOpenChange, vehiculo, onSave }: VehiculoFormDialogProps) {
  const [formData, setFormData] = useState<Vehiculo>({
    placa: "",
    marca: "",
    anio: null,
    tipoVehiculo: "cisterna",
    capacidadLitros: null,
    combustible: "diésel",
    chasis: null,
    nroSoat: null,
    vencSoat: null,
    nroItv: null,
    vencItv: null,
    nroPermiso: null,
    vencPermiso: null,
    gpsId: null,
    gpsActivo: false,
    estado: "activo",
  })

  useEffect(() => {
    if (vehiculo) {
      setFormData(vehiculo)
    } else {
      setFormData({
        placa: "",
        marca: "",
        anio: null,
        tipoVehiculo: "cisterna",
        capacidadLitros: null,
        combustible: "diésel",
        chasis: null,
        nroSoat: null,
        vencSoat: null,
        nroItv: null,
        vencItv: null,
        nroPermiso: null,
        vencPermiso: null,
        gpsId: null,
        gpsActivo: false,
        estado: "activo",
      })
    }
  }, [vehiculo, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <VehiculoForm formData={formData} setFormData={setFormData} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600">
              {vehiculo ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
