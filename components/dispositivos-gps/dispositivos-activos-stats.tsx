"use client"

import { motion } from "framer-motion"
import { Radio, Wifi, LinkIcon, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"

interface DispositivosActivosStatsProps {
  dispositivos: DispositivoConVehiculo[]
}

export function DispositivosActivosStats({ dispositivos }: DispositivosActivosStatsProps) {
  const total = dispositivos.length
  const conectados = dispositivos.filter((d) => d.conectado).length
  const vinculados = dispositivos.filter((d) => d.vehiculoId).length
  const sinVincular = total - vinculados

  const stats = [
    {
      label: "Total Dispositivos",
      value: total,
      icon: Radio,
      color: "text-forest-green-600",
      bgColor: "bg-forest-green-100",
    },
    {
      label: "En Línea",
      value: conectados,
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Vinculados",
      value: vinculados,
      icon: LinkIcon,
      color: "text-vibrant-orange-600",
      bgColor: "bg-vibrant-orange-100",
    },
    {
      label: "Sin Vincular",
      value: sinVincular,
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
