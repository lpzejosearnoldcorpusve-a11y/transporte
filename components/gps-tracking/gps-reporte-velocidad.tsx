"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function GpsReporteVelocidad() {
  const datosVelocidad = [
    { hora: "08:00", velocidad: 35, limite: 60 },
    { hora: "09:00", velocidad: 48, limite: 60 },
    { hora: "10:00", velocidad: 52, limite: 60 },
    { hora: "11:00", velocidad: 45, limite: 60 },
    { hora: "12:00", velocidad: 65, limite: 60 },
    { hora: "13:00", velocidad: 50, limite: 60 },
  ]

  const excesosVelocidad = datosVelocidad.filter((d) => d.velocidad > d.limite).length
  const velocidadMaxima = Math.max(...datosVelocidad.map((d) => d.velocidad))

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Velocidad y Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-600">Excesos de Velocidad</p>
                <p className="text-2xl font-bold text-red-600">{excesosVelocidad}</p>
              </div>
              <div className="rounded-lg bg-vibrant-orange-50 p-4">
                <p className="text-sm text-gray-600">Velocidad Máxima</p>
                <p className="text-2xl font-bold text-vibrant-orange-600">{velocidadMaxima} km/h</p>
              </div>
              <div className="rounded-lg bg-forest-green-50 p-4">
                <p className="text-sm text-gray-600">Conducción Segura</p>
                <p className="text-2xl font-bold text-forest-green-600">
                  {datosVelocidad.length - excesosVelocidad}/{datosVelocidad.length}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosVelocidad}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocidad" stroke="#f97316" strokeWidth={2} name="Velocidad Actual" />
                <Line
                  type="monotone"
                  dataKey="limite"
                  stroke="#16a34a"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Límite"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
