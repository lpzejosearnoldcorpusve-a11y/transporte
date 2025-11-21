"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Ruta } from "@/types/ruta"

interface RutasReporteEficienciaProps {
  rutas: Ruta[]
}

export function RutasReporteEficiencia({ rutas }: RutasReporteEficienciaProps) {
  const datosEficiencia = rutas.slice(0, 6).map((ruta, index) => ({
    nombre: `Ruta ${index + 1}`,
    eficiencia: Math.floor(Math.random() * 30) + 70,
    distancia: ruta.distanciaKm || 0,
  }))

  const eficienciaPromedio =
    datosEficiencia.length > 0
      ? (datosEficiencia.reduce((acc, d) => acc + d.eficiencia, 0) / datosEficiencia.length).toFixed(1)
      : 0

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Eficiencia de Rutas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-vibrant-orange-50 p-4">
                <p className="text-sm text-gray-600">Eficiencia Promedio</p>
                <p className="text-2xl font-bold text-vibrant-orange-600">{eficienciaPromedio}%</p>
              </div>
              <div className="rounded-lg bg-forest-green-50 p-4">
                <p className="text-sm text-gray-600">Rutas Monitoreadas</p>
                <p className="text-2xl font-bold text-forest-green-600">{rutas.length}</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-4">
                <p className="text-sm text-gray-600">KM Recorridos</p>
                <p className="text-2xl font-bold text-sky-600">
                  {rutas.reduce((a, r) => a + Number(r.distanciaKm || 0), 0).toFixed(0)}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosEficiencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="eficiencia" fill="#f97316" name="Eficiencia %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
