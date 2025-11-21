"use client"

import { motion } from "framer-motion"
import type { ReporteConductor } from "@/types/reportes"
import { Card } from "@/components/ui/card"

interface ReporteConductoresEstadisticasProps {
  reportes: ReporteConductor[]
}

export function ReporteConductoresEstadisticas({ reportes }: ReporteConductoresEstadisticasProps) {
  const activos = reportes.filter((c) => c.estado === "activo").length
  const licenciasVencidas = reportes.filter((c) => c.licenciaVencida).length
  const licenciasProxVencer = reportes.filter((c) => c.licenciaProxVencer && !c.licenciaVencida).length
  const documentosIncompletos = reportes.filter((c) => !c.documentosCompletos).length

  const stats = [
    { label: "Conductores Activos", valor: activos, color: "bg-green-500" },
    { label: "Licencias Vencidas", valor: licenciasVencidas, color: "bg-red-500" },
    { label: "Próximas a Vencer", valor: licenciasProxVencer, color: "bg-yellow-500" },
    { label: "Documentos Incompletos", valor: documentosIncompletos, color: "bg-orange-500" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="overflow-hidden p-0">
            <div className={`h-1 ${stat.color}`}></div>
            <div className="p-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-forest-green-900">{stat.valor}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
