"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RutasTable } from "@/components/rutas/rutas-table"
import { RutaFormDialog } from "@/components/rutas/ruta-form-dialog"
import { RutasEstadisticas } from "@/components/rutas/rutas-estadisticas"
import { RutasReporteEficiencia } from "@/components/rutas/rutas-reporte-eficiencia"
import { useRutas } from "@/hooks/use-rutas"
import { useRutaMutations } from "@/hooks/use-ruta-mutations"
import { useToast } from "@/hooks/use-toast"
import type { Ruta, RutaFormData } from "@/types/ruta"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RutasPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRuta, setSelectedRuta] = useState<Ruta | undefined>()
  const { toast } = useToast()

  const { rutas, loading, refetch } = useRutas()
  const { createRuta, updateRuta, deleteRuta } = useRutaMutations(() => {
    refetch()
    setDialogOpen(false)
    setSelectedRuta(undefined)
  })

  const handleSubmit = async (data: RutaFormData) => {
    try {
      if (selectedRuta) {
        await updateRuta(selectedRuta.id, data)
        toast({
          title: "Ruta actualizada",
          description: "La ruta se actualizó correctamente",
        })
      } else {
        await createRuta(data)
        toast({
          title: "Ruta creada",
          description: "La ruta se creó correctamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar la ruta",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (ruta: Ruta) => {
    setSelectedRuta(ruta)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRuta(id)
      toast({
        title: "Ruta eliminada",
        description: "La ruta se eliminó correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la ruta",
        variant: "destructive",
      })
    }
  }

  const handleNewRuta = () => {
    setSelectedRuta(undefined)
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="p-6">Cargando rutas...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rutas</h1>
          <p className="text-gray-600">Gestiona las rutas de transporte</p>
        </div>
        <Button onClick={handleNewRuta} className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      <Tabs defaultValue="gestion" className="w-full">
        <TabsList>
          <TabsTrigger value="gestion">Gestión</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="eficiencia">Reporte de Eficiencia</TabsTrigger>
        </TabsList>

        <TabsContent value="gestion" className="space-y-4">
          <RutasTable rutas={rutas} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="estadisticas">
          <RutasEstadisticas rutas={rutas} />
        </TabsContent>

        <TabsContent value="eficiencia">
          <RutasReporteEficiencia rutas={rutas} />
        </TabsContent>
      </Tabs>

      <RutaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} ruta={selectedRuta} onSubmit={handleSubmit} />
    </div>
  )
}
