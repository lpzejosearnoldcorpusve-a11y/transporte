"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReporteRuta } from "@/types/reportes"
import { Route, Clock, MapPin, CheckCircle, XCircle, Truck } from "lucide-react"

interface ReporteRutasEstadisticasProps {
  reportes: ReporteRuta[]
}

export function ReporteRutasEstadisticas({ reportes }: ReporteRutasEstadisticasProps) {
  const estadisticas = {
    totalRutas: reportes.length,
    rutasActivas: reportes.filter((r) => r.estado.toLowerCase() === "activa").length,
    rutasCompletadas: reportes.filter((r) => r.estado.toLowerCase() === "completada").length,
    rutasCanceladas: reportes.filter((r) => r.estado.toLowerCase() === "cancelada").length,
    distanciaTotal: reportes.reduce((sum, r) => sum + r.distanciaKm, 0),
    tiempoPromedioHoras: reportes.length > 0 
      ? reportes.reduce((sum, r) => sum + r.duracionMinutos, 0) / reportes.length / 60 
      : 0,
    vehiculosAsignados: new Set(reportes.filter(r => r.vehiculoId).map(r => r.vehiculoId)).size,
  }

  const porcentajeExito = estadisticas.totalRutas > 0 
    ? ((estadisticas.rutasCompletadas / estadisticas.totalRutas) * 100).toFixed(1) 
    : "0"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rutas</CardTitle>
          <Route className="h-4 w-4 text-forest-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.totalRutas}</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.rutasActivas} activas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{porcentajeExito}%</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.rutasCompletadas} completadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
          <MapPin className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.distanciaTotal.toLocaleString()} km</div>
          <p className="text-xs text-muted-foreground">
            Promedio: {estadisticas.totalRutas > 0 ? (estadisticas.distanciaTotal / estadisticas.totalRutas).toFixed(1) : 0} km/ruta
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {estadisticas.tiempoPromedioHoras.toFixed(1)}h
          </div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.vehiculosAsignados} vehículos asignados
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estado de Rutas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Activas: {estadisticas.rutasActivas}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Completadas: {estadisticas.rutasCompletadas}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Canceladas: {estadisticas.rutasCanceladas}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Pendientes: {estadisticas.totalRutas - estadisticas.rutasActivas - estadisticas.rutasCompletadas - estadisticas.rutasCanceladas}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}