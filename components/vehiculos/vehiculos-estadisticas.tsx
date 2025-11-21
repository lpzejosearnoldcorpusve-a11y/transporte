"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Vehiculo } from "@/types/vehiculo"

interface VehiculosEstadisticasProps {
  vehiculos: Vehiculo[]
}

export function VehiculosEstadisticas({ vehiculos }: VehiculosEstadisticasProps) {
  const activos = vehiculos.filter((v) => v.estado === "disponible").length
  const enMantenimiento = vehiculos.filter((v) => v.estado === "mantenimiento").length
  const enRuta = vehiculos.filter((v) => v.estado === "en_ruta").length

  const stats = [
    { label: "Total de Vehículos", value: vehiculos.length, icon: "🚛", color: "bg-sky-50", textColor: "text-sky-600" },
    {
      label: "Disponibles",
      value: activos,
      icon: "✅",
      color: "bg-forest-green-50",
      textColor: "text-forest-green-600",
    },
    { label: "En Ruta", value: enRuta, icon: "🛣", color: "bg-vibrant-orange-50", textColor: "text-vibrant-orange-600" },
    { label: "En Mantenimiento", value: enMantenimiento, icon: "🔧", color: "bg-red-50", textColor: "text-red-600" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`${stat.color} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
