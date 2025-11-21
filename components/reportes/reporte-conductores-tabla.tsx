"use client"

import { motion } from "framer-motion"
import type { ReporteConductor } from "@/types/reportes"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ReporteConductoresTablaProps {
  reportes: ReporteConductor[]
  isLoading: boolean
}

export function ReporteConductoresTabla({ reportes, isLoading }: ReporteConductoresTablaProps) {
  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando reportes...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {reportes.map((conductor, idx) => (
        <motion.div
          key={conductor.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-forest-green-900">
                  {conductor.nombre} {conductor.apellido}
                </h3>
                <p className="text-sm text-gray-600">CI: {conductor.ci}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant={conductor.estado === "activo" ? "default" : "success"}>{conductor.estado}</Badge>
                  <Badge variant={conductor.licenciaVencida ? "danger" : "default"}>
                    {conductor.licenciaVencida ? "Licencia Vencida" : `${conductor.diasParaVencer} días`}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-vibrant-orange-500">{conductor.viajesTotales}</p>
                <p className="text-xs text-gray-500">Viajes totales</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
