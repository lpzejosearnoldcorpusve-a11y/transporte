"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

  const { vehiculos, loading } = useVehiculos()

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
            <div className="text-sm text-muted-foreground mt-1">
            Vincula el dispositivo {dispositivo?.imei} a un vehículo para comenzar el seguimiento
            </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiculo">Vehículo</Label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded px-3 py-2 text-left bg-white"
                    disabled={loading}
                  >
                    {vehiculoId
                      ? vehiculosDisponibles.find((v) => v.id === vehiculoId)?.placa +
                        " - " +
                        vehiculosDisponibles.find((v) => v.id === vehiculoId)?.marca
                      : "Selecciona un vehículo"}
                  </button>
                </div>
                <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
                  {vehiculosDisponibles.map((vehiculo) => (
                    <li
                      key={vehiculo.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        vehiculoId === vehiculo.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setVehiculoId(vehiculo.id)}
                      tabIndex={0}
                      role="option"
                      aria-selected={vehiculoId === vehiculo.id}
                    >
                      {vehiculo.placa} - {vehiculo.marca}
                    </li>
                  ))}
                </ul>
              </Select>
            )}
            {vehiculosDisponibles.length === 0 && !loading && (
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
