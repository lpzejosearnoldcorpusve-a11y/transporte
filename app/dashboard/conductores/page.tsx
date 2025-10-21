"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useConductores } from "@/hooks/use-conductores"
import { useConductorMutations } from "@/hooks/use-conductor-mutations"
import { ConductoresTable } from "@/components/conductores/conductores-table"
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog"
import type { Conductor, ConductorFormData } from "@/types/conductor"
import { useToast } from "@/hooks/use-toast"

export default function ConductoresPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null)

  const { conductores, loading, refetch } = useConductores()
  const { createConductor, updateConductor, deleteConductor, loading: mutationLoading } = useConductorMutations()
  const { toast } = useToast()

  const handleCreate = () => {
    setSelectedConductor(null)
    setDialogOpen(true)
  }

  const handleEdit = (conductor: Conductor) => {
    setSelectedConductor(conductor)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: ConductorFormData) => {
    try {
      if (selectedConductor) {
        await updateConductor(selectedConductor.id, data)
        toast({
          title: "Conductor actualizado",
          description: "El conductor se actualizó correctamente",
        })
      } else {
        await createConductor(data)
        toast({
          title: "Conductor creado",
          description: "El conductor se creó correctamente",
        })
      }
      setDialogOpen(false)
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar conductor",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este conductor?")) return

    try {
      await deleteConductor(id)
      toast({
        title: "Conductor eliminado",
        description: "El conductor se eliminó correctamente",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar conductor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conductores</h1>
          <p className="text-muted-foreground">Gestiona los conductores y sus licencias</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Conductor
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando conductores...</div>
      ) : (
        <ConductoresTable conductores={conductores} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ConductorFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        conductor={selectedConductor}
        onSubmit={handleSubmit}
        loading={mutationLoading}
      />
    </div>
  )
}
