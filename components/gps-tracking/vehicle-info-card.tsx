"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { VehiculoTracking } from "@/types/gps-tracking"
import { Gauge, Navigation, Satellite, Mountain, Clock } from "lucide-react"

interface VehicleInfoCardProps {
  vehiculo: VehiculoTracking
}

export function VehicleInfoCard({ vehiculo }: VehicleInfoCardProps) {
  const { posicion, vehiculo: vehiculoInfo } = vehiculo

  const infoItems = [
    {
      icon: Gauge,
      label: "Velocidad",
      value: `${posicion.velocidad?.toFixed(1) || "0"} km/h`,
      color: "text-vibrant-orange-600",
    },
    {
      icon: Navigation,
      label: "Dirección",
      value: "N/A",
      color: "text-blue-600",
    },
    {
      icon: Mountain,
      label: "Altitud",
      value: `${posicion.altitud?.toFixed(0) || "N/A"} m`,
      color: "text-green-600",
    },
    {
      icon: Satellite,
      label: "Satélites",
      value: posicion.satelites?.toString() || "N/A",
      color: "text-purple-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white shadow-xl">
        <div className="bg-gradient-to-r from-forest-green-900 to-forest-green-700 p-4 text-white">
          <h3 className="text-lg font-bold">{vehiculoInfo.placa}</h3>
          <p className="text-sm opacity-90">{vehiculoInfo.marca}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
              <p className="mt-1 text-lg font-bold text-gray-900">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Última actualización:</span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {new Date(posicion.timestamp).toLocaleString("es-BO")}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
