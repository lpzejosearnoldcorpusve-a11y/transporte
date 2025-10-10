"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wrench, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { VehiculosGrid } from "@/components/mantenimiento/vehiculos-grid"
import { IniciarMantenimientoDialog } from "@/components/mantenimiento/iniciar-mantenimiento-dialog"
import { CompletarMantenimientoDialog } from "@/components/mantenimiento/completar-mantenimiento-dialog"
import { HistorialMantenimiento } from "@/components/mantenimiento/historial-mantenimiento"
import { useMantenimientos } from "@/hooks/use-mantenimientos"
import { useMantenimientoMutations } from "@/hooks/use-mantenimiento-mutations"
import type { VehiculoConMantenimiento } from "@/types/mantenimiento"

export default function MantenimientoPage() {
  const [vehiculos, setVehiculos] = useState<VehiculoConMantenimiento[]>([])
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoConMantenimiento | null>(null)
  const [iniciarDialogOpen, setIniciarDialogOpen] = useState(false)
  const [completarDialogOpen, setCompletarDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const { mantenimientos, refetch: refetchMantenimientos } = useMantenimientos()
  const { iniciarMantenimiento, completarMantenimiento } = useMantenimientoMutations()
  const { toast } = useToast()

  useEffect(() => {
    fetchVehiculos()
  }, [])

  const fetchVehiculos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vehiculos")
      const data = await response.json()

      // Obtener mantenimientos activos
      const mantenimientosResponse = await fetch("/api/mantenimientos?estado=en_proceso")
      const mantenimientosActivos = await mantenimientosResponse.json()

      // Combinar datos
      const vehiculosConMantenimiento = data.map((v: any) => ({
        ...v,
        mantenimientoActivo: mantenimientosActivos.find((m: any) => m.vehiculoId === v.id),
      }))

      setVehiculos(vehiculosConMantenimiento)
    } catch (error) {
      console.error("Error al cargar vehículos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los vehículos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectVehiculo = (vehiculo: VehiculoConMantenimiento) => {
    setSelectedVehiculo(vehiculo)

    if (vehiculo.estado === "mantenimiento" && vehiculo.mantenimientoActivo) {
      setCompletarDialogOpen(true)
    } else if (vehiculo.estado === "activo") {
      setIniciarDialogOpen(true)
    }
  }

  const handleIniciarMantenimiento = async (data: any) => {
    try {
      await iniciarMantenimiento(data)
      toast({
        title: "Mantenimiento iniciado",
        description: "El vehículo ha sido puesto en mantenimiento",
      })
      fetchVehiculos()
      refetchMantenimientos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el mantenimiento",
        variant: "destructive",
      })
    }
  }

  const handleCompletarMantenimiento = async (id: string, data: any) => {
    try {
      await completarMantenimiento(id, data)
      toast({
        title: "Mantenimiento completado",
        description: "El vehículo ha sido reactivado",
      })
      fetchVehiculos()
      refetchMantenimientos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar el mantenimiento",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-forest-green-900">Gestión de Mantenimiento</h1>
          <p className="text-gray-600">Administra el mantenimiento de tu flota de vehículos</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="vehiculos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vehiculos" className="gap-2">
            <Wrench className="h-4 w-4" />
            Vehículos
          </TabsTrigger>
          <TabsTrigger value="historial" className="gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehiculos" className="space-y-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-vibrant-orange-500 border-t-transparent" />
            </div>
          ) : (
            <VehiculosGrid
              vehiculos={vehiculos}
              onSelectVehiculo={handleSelectVehiculo}
              selectedId={selectedVehiculo?.id}
            />
          )}
        </TabsContent>

        <TabsContent value="historial">
          <HistorialMantenimiento mantenimientos={mantenimientos} />
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <IniciarMantenimientoDialog
        open={iniciarDialogOpen}
        onOpenChange={setIniciarDialogOpen}
        vehiculo={selectedVehiculo}
        onSubmit={handleIniciarMantenimiento}
      />

      <CompletarMantenimientoDialog
        open={completarDialogOpen}
        onOpenChange={setCompletarDialogOpen}
        mantenimiento={selectedVehiculo?.mantenimientoActivo || null}
        onSubmit={handleCompletarMantenimiento}
      />
    </div>
  )
}
