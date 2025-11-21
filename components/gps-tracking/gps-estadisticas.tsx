"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function GpsEstadisticas() {
  const estadisticas = [
    { label: "Vehículos en Vivo", value: 12, color: "bg-vibrant-orange-50", textColor: "text-vibrant-orange-600" },
    { label: "Velocidad Promedio", value: "45 km/h", color: "bg-forest-green-50", textColor: "text-forest-green-600" },
    { label: "Distancia Recorrida Hoy", value: "324 km", color: "bg-sky-50", textColor: "text-sky-600" },
    { label: "Alertas Activas", value: 3, color: "bg-red-50", textColor: "text-red-600" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {estadisticas.map((stat, index) => (
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
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
