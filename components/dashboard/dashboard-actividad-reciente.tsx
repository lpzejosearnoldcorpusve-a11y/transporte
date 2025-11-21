"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface ActividadItem {
  tipo: string
  descripcion: string
  tiempo: string
  icon: string
}

interface DashboardActividadRecienteProps {
  actividadReciente: ActividadItem[]
}

function getIconComponent(iconName: string) {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-4 w-4" /> : <Activity className="h-4 w-4" />
}

function getTipoColor(tipo: string): string {
  switch (tipo) {
    case 'viaje':
      return 'text-green-600'
    case 'vehiculo':
      return 'text-blue-600'
    case 'mantenimiento':
      return 'text-orange-600'
    case 'documento':
      return 'text-green-600'
    case 'ruta':
      return 'text-purple-600'
    default:
      return 'text-gray-600'
  }
}

export function DashboardActividadReciente({ actividadReciente }: DashboardActividadRecienteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-vibrant-orange-600" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>Últimas operaciones del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actividadReciente.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No hay actividad reciente</p>
                </div>
              </div>
            ) : (
              actividadReciente.map((actividad, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className={`p-2 rounded-full bg-gray-100 ${getTipoColor(actividad.tipo)}`}>
                    {getIconComponent(actividad.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-5">
                      {actividad.descripcion}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {actividad.tiempo}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      actividad.tipo === 'viaje' ? 'bg-green-400' :
                      actividad.tipo === 'vehiculo' ? 'bg-blue-400' :
                      actividad.tipo === 'mantenimiento' ? 'bg-orange-400' :
                      actividad.tipo === 'documento' ? 'bg-green-400' :
                      'bg-purple-400'
                    }`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Indicador de carga más actividades */}
          {actividadReciente.length >= 5 && (
            <div className="mt-4 pt-4 border-t">
              <button className="w-full text-center text-sm text-vibrant-orange-600 hover:text-vibrant-orange-700 font-medium transition-colors">
                Ver toda la actividad →
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}