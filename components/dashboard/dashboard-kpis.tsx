"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Truck, MapPin, Clock, Users, Wrench, AlertTriangle } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  color: string
  delay?: number
}

function KPICard({ title, value, description, icon, color, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-vibrant-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-green-900 mb-1">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface DashboardKPIsProps {
  stats: {
    vehiculosActivos: number
    viajesHoy: number
    viajesEnTransito: number
    conductoresActivos: number
    mantenimientosEnProceso: number
    alertasGps: number
  }
}

export function DashboardKPIs({ stats }: DashboardKPIsProps) {
  const kpis = [
    {
      title: "Vehículos Activos",
      value: stats.vehiculosActivos,
      description: "vehículos operativos",
      icon: <Truck className="h-5 w-5 text-blue-600" />,
      color: "text-blue-600",
      delay: 0.1
    },
    {
      title: "Viajes Hoy",
      value: stats.viajesHoy,
      description: "viajes programados",
      icon: <MapPin className="h-5 w-5 text-green-600" />,
      color: "text-green-600",
      delay: 0.2
    },
    {
      title: "En Tránsito",
      value: stats.viajesEnTransito,
      description: "viajes activos",
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      color: "text-orange-600",
      delay: 0.3
    },
    {
      title: "Conductores",
      value: stats.conductoresActivos,
      description: "conductores disponibles",
      icon: <Users className="h-5 w-5 text-purple-600" />,
      color: "text-purple-600",
      delay: 0.4
    },
    {
      title: "Mantenimiento",
      value: stats.mantenimientosEnProceso,
      description: "en proceso",
      icon: <Wrench className="h-5 w-5 text-yellow-600" />,
      color: "text-yellow-600",
      delay: 0.5
    },
    {
      title: "Alertas GPS",
      value: stats.alertasGps,
      description: "requieren atención",
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      color: "text-red-600",
      delay: 0.6
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  )
}