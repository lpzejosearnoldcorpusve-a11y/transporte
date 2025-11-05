"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { VehiculoTracking } from "@/types/gps-tracking"
import { Truck, Activity, Zap } from "lucide-react"

interface TrackingStatsProps {
  vehiculos: VehiculoTracking[]
}

export function TrackingStats({ vehiculos }: TrackingStatsProps) {
  const vehiculosActivos = vehiculos.filter((v) => (v.posicion.velocidad || 0) > 0).length
  const velocidadPromedio = vehiculos.reduce((acc, v) => acc + (v.posicion.velocidad || 0), 0) / vehiculos.length || 0

  const stats = [
    {
      icon: Truck,
      label: "Total",
      value: vehiculos.length,
      color: "bg-blue-500",
    },
    {
      icon: Activity,
      label: "En movimiento",
      value: vehiculosActivos,
      color: "bg-green-500",
    },
    {
      icon: Zap,
      label: "Vel. Promedio",
      value: `${velocidadPromedio.toFixed(0)} km/h`,
      color: "bg-vibrant-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-white shadow-lg">
            <div className={`${stat.color} p-2`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
