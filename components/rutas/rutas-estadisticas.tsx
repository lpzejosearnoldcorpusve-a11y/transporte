"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Ruta } from "@/types/ruta"

interface RutasEstadisticasProps {
  rutas: Ruta[]
}

export function RutasEstadisticas({ rutas }: RutasEstadisticasProps) {
  const totalDistancia = rutas.reduce((acc, ruta) => acc + Number(ruta.distanciaKm || 0), 0)
  const totalDuracion = rutas.reduce((acc, ruta) => acc + Number(ruta.duracionMinutos || 0), 0)
  const rutasActivas = rutas.filter((r) => r.estado === "en_curso").length
  const distanciaPromedio = rutas.length > 0 ? (totalDistancia / rutas.length).toFixed(2) : 0

  const stats = [
    { label: "Distancia Total", value: `${totalDistancia.toFixed(2)} km`, icon: "📍" },
    { label: "Duración Total", value: `${(totalDuracion / 60).toFixed(0)} horas`, icon: "⏱" },
    { label: "Rutas Activas", value: rutasActivas, icon: "✅" },
    { label: "Distancia Promedio", value: `${distanciaPromedio} km`, icon: "📊" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-vibrant-orange-600">{stat.value}</span>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
