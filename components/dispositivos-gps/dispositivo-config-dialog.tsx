"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select} from "@/components/ui/select"
import type { DispositivoConVehiculo, EstadoDispositivo } from "@/types/dispositivo-gps"
import { Loader2 } from "lucide-react"

interface DispositivoConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dispositivo: DispositivoConVehiculo | null
  onActualizar: (id: string, data: any) => Promise<void>
}

export function DispositivoConfigDialog({
  open,
  onOpenChange,
  dispositivo,
  onActualizar,
}: DispositivoConfigDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    modelo: "",
    fabricante: "",
    numeroSerie: "",
    intervaloReporte: 30,
    alertaVelocidad: 0,
    alertaCombustible: 0,
    estado: "activo" as EstadoDispositivo,
    observaciones: "",
  })

  useEffect(() => {
    if (dispositivo) {
      setFormData({
        modelo: dispositivo.modelo || "",
        fabricante: dispositivo.fabricante || "",
        numeroSerie: dispositivo.numeroSerie || "",
        intervaloReporte: Number(dispositivo.intervaloReporte) || 30,
        alertaVelocidad: Number(dispositivo.alertaVelocidad) || 0,
        alertaCombustible: Number(dispositivo.alertaCombustible) || 0,
        estado: dispositivo.estado as EstadoDispositivo,
        observaciones: dispositivo.observaciones || "",
      })
    }
  }, [dispositivo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dispositivo) return

    setIsSubmitting(true)
    try {
      await onActualizar(dispositivo.id, formData)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Dispositivo GPS</DialogTitle>
        <p className="text-muted-foreground text-sm mt-1">
            Configura los parámetros del dispositivo {dispositivo?.imei}
        </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ej: GT06N"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                placeholder="Ej: Concox"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroSerie">Número de Serie</Label>
            <Input
              id="numeroSerie"
              value={formData.numeroSerie}
              onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
              placeholder="Número de serie del dispositivo"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="intervaloReporte">Intervalo de Reporte (seg)</Label>
              <Input
                id="intervaloReporte"
                type="number"
                min="10"
                max="3600"
                value={formData.intervaloReporte}
                onChange={(e) => setFormData({ ...formData, intervaloReporte: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertaVelocidad">Alerta Velocidad (km/h)</Label>
              <Input
                id="alertaVelocidad"
                type="number"
                min="0"
                value={formData.alertaVelocidad}
                onChange={(e) => setFormData({ ...formData, alertaVelocidad: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertaCombustible">Alerta Combustible (%)</Label>
              <Input
                id="alertaCombustible"
                type="number"
                min="0"
                max="100"
                value={formData.alertaCombustible}
                onChange={(e) => setFormData({ ...formData, alertaCombustible: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoDispositivo })}
            >
              <button
                type="button"
                className="select-trigger"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                {formData.estado.charAt(0).toUpperCase() + formData.estado.slice(1)}
              </button>
              <div className="select-content">
                <button
                  type="button"
                  className={`select-item${formData.estado === "activo" ? " selected" : ""}`}
                  onClick={() => setFormData({ ...formData, estado: "activo" })}
                >
                  Activo
                </button>
                <button
                  type="button"
                  className={`select-item${formData.estado === "inactivo" ? " selected" : ""}`}
                  onClick={() => setFormData({ ...formData, estado: "inactivo" })}
                >
                  Inactivo
                </button>
                <button
                  type="button"
                  className={`select-item${formData.estado === "mantenimiento" ? " selected" : ""}`}
                  onClick={() => setFormData({ ...formData, estado: "mantenimiento" })}
                >
                  Mantenimiento
                </button>
              </div>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Notas adicionales"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
