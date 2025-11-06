"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select" 
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { Loader2 } from "lucide-react"

interface VincularVehiculoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dispositivo: DispositivoConVehiculo | null
  onVincular: (imei: string, vehiculoId: string, fechaInstalacion?: Date) => Promise<void>
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
    
    // DEBUG: Verificar valores antes de enviar
    console.log("🔍 Valores del formulario:", {
      dispositivo: dispositivo?.imei,
      vehiculoId,
      fechaInstalacion
    })

    if (!dispositivo || !vehiculoId) {
      console.error("❌ Faltan datos requeridos:", { 
        dispositivo: !!dispositivo, 
        vehiculoId: !!vehiculoId 
      })
      return
    }

    setIsSubmitting(true)
    try {
      console.log("🚀 Iniciando vinculación...")
      
      await onVincular(
        dispositivo.imei,
        vehiculoId,
        fechaInstalacion ? new Date(fechaInstalacion) : undefined
      )

      console.log("✅ Vinculación exitosa")
      
      onOpenChange(false)
      setVehiculoId("")
      setFechaInstalacion("")
    } catch (error) {
      console.error("💥 Error en la vinculación:", error)
      
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
            Vincula el dispositivo <strong>{dispositivo?.imei}</strong> 
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiculo">Vehículo *</Label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select
                value={vehiculoId}
                onChange={(e) => {
                  console.log("🚗 Vehículo seleccionado:", e.target.value)
                  setVehiculoId(e.target.value)
                }}
                required
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculosDisponibles.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.placa} - {vehiculo.marca}
                  </option>
                ))}
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                console.log("❌ Cancelando vinculación")
                onOpenChange(false)
              }} 
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!vehiculoId || isSubmitting}
            >
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