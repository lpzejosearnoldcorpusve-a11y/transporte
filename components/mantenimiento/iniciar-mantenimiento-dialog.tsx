"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Building2, Phone, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { VehiculoConMantenimiento, MantenimientoFormData } from "@/types/mantenimiento"

interface IniciarMantenimientoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculo: VehiculoConMantenimiento | null
  onSubmit: (data: MantenimientoFormData) => Promise<void>
}

export function IniciarMantenimientoDialog({
  open,
  onOpenChange,
  vehiculo,
  onSubmit,
}: IniciarMantenimientoDialogProps) {
  const [formData, setFormData] = useState({
    fechaInicio: new Date().toISOString().split("T")[0],
    nombreTaller: "",
    contactoTaller: "",
    descripcionProblema: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehiculo) return

    setLoading(true)
    try {
      await onSubmit({
        vehiculoId: vehiculo.id,
        fechaInicio: new Date(formData.fechaInicio),
        nombreTaller: formData.nombreTaller,
        contactoTaller: formData.contactoTaller,
        descripcionProblema: formData.descripcionProblema,
      })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Iniciar Mantenimiento</DialogTitle>
          <div className="text-muted-foreground text-sm">
            Registra el inicio del mantenimiento para el vehículo{" "}
            <span className="font-bold text-forest-green-700">{vehiculo?.placa}</span>
          </div>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Fecha de inicio */}
          <div className="space-y-2">
            <Label htmlFor="fechaInicio" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Inicio
            </Label>
            <Input
              id="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              required
            />
          </div>

          {/* Nombre del taller */}
          <div className="space-y-2">
            <Label htmlFor="nombreTaller" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Nombre del Taller
            </Label>
            <Input
              id="nombreTaller"
              placeholder="Ej: Taller Mecánico Los Andes"
              value={formData.nombreTaller}
              onChange={(e) => setFormData({ ...formData, nombreTaller: e.target.value })}
            />
          </div>

          {/* Contacto del taller */}
          <div className="space-y-2">
            <Label htmlFor="contactoTaller" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contacto del Taller
            </Label>
            <Input
              id="contactoTaller"
              placeholder="Teléfono o email"
              value={formData.contactoTaller}
              onChange={(e) => setFormData({ ...formData, contactoTaller: e.target.value })}
            />
          </div>

          {/* Descripción del problema */}
          <div className="space-y-2">
            <Label htmlFor="descripcionProblema" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción del Problema
            </Label>
            <textarea
              id="descripcionProblema"
              className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange-500"
              placeholder="Describe el problema o motivo del mantenimiento..."
              value={formData.descripcionProblema}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descripcionProblema: e.target.value,
                })
              }
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600">
              {loading ? "Iniciando..." : "Iniciar Mantenimiento"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
