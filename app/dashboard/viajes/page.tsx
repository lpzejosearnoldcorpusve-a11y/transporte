"use client"

import { useState } from "react"
import { useViajes } from "@/hooks/use-viajes"
import { ViajeFormDialog } from "@/components/viajes/viaje-form-dialog"
import { ViajasTable } from "@/components/viajes/viajes-table"
import { ViajeCard } from "@/components/viajes/viaje-card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, LayoutList } from "lucide-react"
import { motion } from "framer-motion"

export default function ViajasPage() {
  const { viajes, isLoading, mutate } = useViajes()
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  console.log("📊 Datos de viajes:", viajes)
  console.log("📦 Primer viaje:", viajes?.[0])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-forest-green-900">Viajes</h1>
          <p className="text-gray-600">
            Gestiona todos los viajes de transporte
            {!isLoading && viajes && ` (${viajes.length} ${viajes.length === 1 ? 'viaje' : 'viajes'})`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <LayoutList className="h-4 w-4" />
              Tabla
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Cuadrícula
            </Button>
          </div>
          <ViajeFormDialog onSuccess={() => mutate()} />
        </div>
      </motion.div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="h-8 w-8 border-4 border-vibrant-orange-500 border-t-forest-green-900 rounded-full" />
          </motion.div>
        </div>
      ) : !viajes || viajes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <div className="text-center space-y-3">
            <div className="text-6xl">📦</div>
            <h3 className="text-lg font-semibold text-gray-700">No hay viajes registrados</h3>
            <p className="text-gray-500 text-sm">Comienza creando tu primer viaje</p>
            <ViajeFormDialog onSuccess={() => mutate()} />
          </div>
        </motion.div>
      ) : viewMode === "table" ? (
        <ViajasTable viajes={viajes} onRefresh={mutate} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {viajes.map((viaje, index) => {
            const viajeData = viaje.viajes || viaje
            
            return (
              <motion.div
                key={viajeData.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ViajeCard 
                  viaje={viajeData}
                  vehiculo={viaje.vehiculos}
                  conductor={viaje.conductores}
                  ruta={viaje.rutas}
                  onRefresh={mutate}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
