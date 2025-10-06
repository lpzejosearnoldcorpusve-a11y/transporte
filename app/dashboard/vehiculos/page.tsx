"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VehiculosTable } from "@/components/vehiculos/vehiculos-table"
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog"
import { useToast } from "@/hooks/use-toast"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useVehiculoMutations } from "@/hooks/use-vehiculo-mutations"
import type { Vehiculo } from "@/types/vehiculo"

export default function VehiculosPage() {
  const { vehiculos, loading, refetch } = useVehiculos()
  const { createVehiculo, updateVehiculo, deleteVehiculo } = useVehiculoMutations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)
  const { toast } = useToast()

  const handleSave = async (vehiculo: Vehiculo) => {
    try {
      if (vehiculo.id) {
        await updateVehiculo(vehiculo.id, vehiculo)
        toast({
          title: "Éxito",
          description: "Vehículo actualizado correctamente",
        })
      } else {
        await createVehiculo(vehiculo)
        toast({
          title: "Éxito",
          description: "Vehículo creado correctamente",
        })
      }
      setDialogOpen(false)
      setSelectedVehiculo(null)
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el vehículo",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo)
    setDialogOpen(true)
  }

  const handleDelete = async (vehiculoId: string) => {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return

    try {
      await deleteVehiculo(vehiculoId)
      toast({
        title: "Éxito",
        description: "Vehículo eliminado correctamente",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el vehículo",
        variant: "destructive",
      })
    }
  }

  const handleNewVehiculo = () => {
    setSelectedVehiculo(null)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">Cargando vehículos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-forest-green-900">Vehículos</h1>
          <p className="text-gray-600">Gestiona la flota de vehículos de transporte</p>
        </div>
        <Button onClick={handleNewVehiculo} className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      <VehiculosTable vehiculos={vehiculos} onEdit={handleEdit} onDelete={handleDelete} />

      <VehiculoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehiculo={selectedVehiculo}
        onSave={handleSave}
      />
    </div>
  )
}
