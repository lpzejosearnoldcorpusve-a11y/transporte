"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Vehiculo } from "@/types/vehiculo"

interface VehiculosReporteDisponibilidadProps {
  vehiculos: Vehiculo[]
}

export function VehiculosReporteDisponibilidad({ vehiculos }: VehiculosReporteDisponibilidadProps) {
  const estadosCount = {
    disponible: vehiculos.filter((v) => v.estado === "disponible").length,
    en_ruta: vehiculos.filter((v) => v.estado === "en_ruta").length,
    mantenimiento: vehiculos.filter((v) => v.estado === "mantenimiento").length,
  }

  const datosDisponibilidad = [
    { name: "Disponibles", value: estadosCount.disponible, fill: "#16a34a" },
    { name: "En Ruta", value: estadosCount.en_ruta, fill: "#f97316" },
    { name: "Mantenimiento", value: estadosCount.mantenimiento, fill: "#ef4444" },
  ]

  const disponibilidad = ((estadosCount.disponible / vehiculos.length) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Disponibilidad de Vehículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-forest-green-50 p-4">
                <p className="text-sm text-gray-600">Disponibilidad</p>
                <p className="text-2xl font-bold text-forest-green-600">{disponibilidad}%</p>
              </div>
              <div className="rounded-lg bg-vibrant-orange-50 p-4">
                <p className="text-sm text-gray-600">Utilización</p>
                <p className="text-2xl font-bold text-vibrant-orange-600">
                  {estadosCount.en_ruta}/{vehiculos.length}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold text-red-600">{estadosCount.mantenimiento}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosDisponibilidad}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosDisponibilidad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
