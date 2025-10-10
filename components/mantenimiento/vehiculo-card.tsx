"use client"

import { motion } from "framer-motion"
import { Truck } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { VehiculoConMantenimiento } from "@/types/mantenimiento"
import { cn } from "@/lib/utils"
import { VehiculoStatusIndicator } from "./vehiculo-status-indicator"

interface VehiculoCardProps {
  vehiculo: VehiculoConMantenimiento
  onSelect: () => void
  isSelected: boolean
  index: number
}

export function VehiculoCard({ vehiculo, onSelect, isSelected, index }: VehiculoCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-105",
          isSelected && "ring-2 ring-vibrant-orange-500 shadow-xl",
        )}
        onClick={onSelect}
      >
        {/* Imagen del vehículo */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-forest-green-100 to-forest-green-200">
          {vehiculo.imagen ? (
            <img
              src={vehiculo.imagen || "/placeholder.svg"}
              alt={vehiculo.placa}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Truck className="h-24 w-24 text-forest-green-400" />
            </div>
          )}

          {/* Badge de estado flotante */}
          <div className="absolute right-3 top-3">
            <VehiculoStatusIndicator estado={vehiculo.estado} size="badge" />
          </div>
        </div>

        {/* Información del vehículo */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold text-forest-green-900">{vehiculo.placa}</h3>
            <VehiculoStatusIndicator estado={vehiculo.estado} size="icon" />
          </div>

          <p className="mb-1 text-sm font-medium text-gray-700">{vehiculo.marca}</p>
          <p className="text-xs text-gray-500">{vehiculo.tipoVehiculo || "Tipo no especificado"}</p>

          {/* Indicador de mantenimiento activo */}
          {vehiculo.mantenimientoActivo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 rounded-lg bg-vibrant-orange-50 p-2 border border-vibrant-orange-200"
            >
              <p className="text-xs font-medium text-vibrant-orange-700">
                En mantenimiento desde {new Date(vehiculo.mantenimientoActivo.fechaInicio).toLocaleDateString()}
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
