"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, TrendingUp, Fuel, Calendar, Users } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface AlertaItem {
  tipo: string
  count: number
  icon: string
  color: string
}

interface ViajesPorDiaItem {
  fecha: string
  viajes: number
}

interface LitrosPorProductoItem {
  producto: string
  litros: number
}

interface DashboardAlertasGraficosProps {
  alertas: AlertaItem[]
  viajesPorDia: ViajesPorDiaItem[]
  litrosPorProducto: LitrosPorProductoItem[]
}

function getIconComponent(iconName: string) {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />
}

export function DashboardAlertasGraficos({
  alertas,
  viajesPorDia,
  litrosPorProducto
}: DashboardAlertasGraficosProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Alertas y Vencimientos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alertas y Vencimientos
            </CardTitle>
            <CardDescription>Documentos próximos a vencer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertas.map((alerta, index) => (
                <motion.div
                  key={alerta.tipo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${alerta.color} bg-opacity-10`}>
                      {getIconComponent(alerta.icon)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{alerta.tipo}</p>
                      <p className="text-xs text-gray-500">
                        {alerta.count === 0 ? 'Todo al día' : `${alerta.count} requieren atención`}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={alerta.count > 0 ? "danger" : "default"}
                    className="font-semibold"
                  >
                    {alerta.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Viajes por Día */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Viajes por Día
            </CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viajesPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value} viajes`, 'Viajes']}
                  />
                  <Bar
                    dataKey="viajes"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Litros por Producto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-green-600" />
              Litros Transportados
            </CardTitle>
            <CardDescription>Por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={litrosPorProducto} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis
                    dataKey="producto"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} L`, 'Litros']}
                  />
                  <Bar
                    dataKey="litros"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}