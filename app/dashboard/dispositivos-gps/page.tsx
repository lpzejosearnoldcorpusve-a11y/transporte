"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DispositivosGrid } from "@/components/dispositivos-gps/dispositivos-grid"
import { DispositivosActivosStats } from "@/components/dispositivos-gps/dispositivos-activos-stats"
import { VincularVehiculoDialog } from "@/components/dispositivos-gps/vincular-vehiculo-dialog"
import { DispositivoConfigDialog } from "@/components/dispositivos-gps/dispositivo-config-dialog"
import { DispositivoFormDialog } from "@/components/dispositivos-gps/dispositivo-form-dialog"
import { useDispositivosGps } from "@/hooks/use-dispositivos-gps"
import { useDispositivoGpsMutations } from "@/hooks/use-dispositivo-gps-mutations"
import type { DispositivoConVehiculo, DispositivoFormData } from "@/types/dispositivo-gps"

export default function DispositivosGpsPage() {
  const { dispositivos, isLoading, mutate } = useDispositivosGps()
  const { crearDispositivo, vincularVehiculo, desvincularVehiculo, actualizarDispositivo } =
    useDispositivoGpsMutations()

  const [crearDialogOpen, setCrearDialogOpen] = useState(false)
  const [vincularDialogOpen, setVincularDialogOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<DispositivoConVehiculo | null>(null)

  const handleCrearDispositivo = async (data: DispositivoFormData) => {
    await crearDispositivo(data)
    mutate()
  }

  const handleVincular = (dispositivo: DispositivoConVehiculo) => {
    setDispositivoSeleccionado(dispositivo)
    setVincularDialogOpen(true)
  }

  const handleDesvincular = async (dispositivo: DispositivoConVehiculo) => {
    if (confirm("¿Estás seguro de desvincular este dispositivo del vehículo?")) {
      await desvincularVehiculo(dispositivo.id)
      mutate()
    }
  }

  const handleConfig = (dispositivo: DispositivoConVehiculo) => {
    setDispositivoSeleccionado(dispositivo)
    setConfigDialogOpen(true)
  }

  const handleVincularSubmit = async (dispositivoId: string, vehiculoId: string, fechaInstalacion?: Date) => {
    await vincularVehiculo({ dispositivoId, vehiculoId, fechaInstalacion })
    mutate()
  }

  const handleActualizarDispositivo = async (id: string, data: any) => {
    await actualizarDispositivo(id, data)
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispositivos GPS</h1>
          <p className="text-gray-600">Gestiona y vincula dispositivos GPS con vehículos</p>
        </div>
        <Button onClick={() => setCrearDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Dispositivo
        </Button>
      </div>

      <DispositivosActivosStats dispositivos={dispositivos} />

      <DispositivosGrid
        dispositivos={dispositivos}
        isLoading={isLoading}
        onVincular={handleVincular}
        onDesvincular={handleDesvincular}
        onConfig={handleConfig}
      />

      <DispositivoFormDialog
        open={crearDialogOpen}
        onOpenChange={setCrearDialogOpen}
        onSubmit={handleCrearDispositivo}
      />

      <VincularVehiculoDialog
        open={vincularDialogOpen}
        onOpenChange={setVincularDialogOpen}
        dispositivo={dispositivoSeleccionado}
        onVincular={handleVincularSubmit}
      />

      <DispositivoConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        dispositivo={dispositivoSeleccionado}
        onActualizar={handleActualizarDispositivo}
      />
    </div>
  )
}
