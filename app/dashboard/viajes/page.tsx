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
          <p className="text-gray-600">Gestiona todos los viajes de transporte</p>
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
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <div className="h-8 w-8 border-4 border-vibrant-orange-500 border-t-forest-green-900 rounded-full" />
          </motion.div>
        </div>
      ) : viewMode === "table" ? (
        <ViajasTable viajes={viajes} onRefresh={mutate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {viajes.map((viaje, index) => (
            <ViajeCard key={index} viaje={viaje.viajes || {}} />
          ))}
        </div>
      )}
    </div>
  )
}
