"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { Loader2 } from "lucide-react"

interface VincularVehiculoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dispositivo: DispositivoConVehiculo | null
  onVincular: (dispositivoId: string, vehiculoId: string, fechaInstalacion?: Date) => Promise<void>
}

export function VincularVehiculoDialog({ open, onOpenChange, dispositivo, onVincular }: VincularVehiculoDialogProps) {
  const [vehiculoId, setVehiculoId] = useState("")
  const [fechaInstalacion, setFechaInstalacion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { vehiculos, loading: isLoading } = useVehiculos()

  // Filtrar solo vehículos sin GPS
  const vehiculosDisponibles = vehiculos.filter((v) => !v.gpsActivo)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dispositivo || !vehiculoId) return

    setIsSubmitting(true)
    try {
      await onVincular(dispositivo.id, vehiculoId, fechaInstalacion ? new Date(fechaInstalacion) : undefined)
      onOpenChange(false)
      setVehiculoId("")
      setFechaInstalacion("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Dispositivo GPS</DialogTitle>
          <DialogDescription>
            Vincula el dispositivo {dispositivo?.imei} a un vehículo para comenzar el seguimiento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiculo">Vehículo</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <select
                id="vehiculo"
                value={vehiculoId}
                onChange={(e) => setVehiculoId(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculosDisponibles.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.placa} - {vehiculo.marca}
                  </option>
                ))}
              </select>
            )}
            {vehiculosDisponibles.length === 0 && !isLoading && (
              <p className="text-sm text-gray-500">No hay vehículos disponibles sin GPS</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaInstalacion">Fecha de Instalación (opcional)</Label>
            <Input
              id="fechaInstalacion"
              type="date"
              value={fechaInstalacion}
              onChange={(e) => setFechaInstalacion(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!vehiculoId || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vinculando...
                </>
              ) : (
                "Vincular"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
