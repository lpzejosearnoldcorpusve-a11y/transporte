"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReporteVehiculo } from "@/types/reportes"
import { Truck, CheckCircle, AlertTriangle, Satellite, Calendar, MapPin } from "lucide-react"

interface ReporteVehiculosEstadisticasProps {
  reportes: ReporteVehiculo[]
}

export function ReporteVehiculosEstadisticas({ reportes }: ReporteVehiculosEstadisticasProps) {
  const estadisticas = {
    totalVehiculos: reportes.length,
    vehiculosActivos: reportes.filter((v) => v.estado.toLowerCase() === "activo").length,
    vehiculosInactivos: reportes.filter((v) => v.estado.toLowerCase() === "inactivo").length,
    vehiculosMantenimiento: reportes.filter((v) => v.estado.toLowerCase() === "mantenimiento").length,
    vehiculosAveriados: reportes.filter((v) => v.estado.toLowerCase() === "averiado").length,
    vehiculosConGPS: reportes.filter((v) => v.gpsActivo).length,
    documentosVigentes: reportes.filter((v) => v.documentosVigentes).length,
    totalViajesMes: reportes.reduce((sum, v) => sum + v.viajesMes, 0),
    distanciaTotal: reportes.reduce((sum, v) => sum + v.distanciaRecorrida, 0),
  }

  const porcentajeOperativo = estadisticas.totalVehiculos > 0 
    ? ((estadisticas.vehiculosActivos / estadisticas.totalVehiculos) * 100).toFixed(1) 
    : "0"

  const porcentajeGPS = estadisticas.totalVehiculos > 0 
    ? ((estadisticas.vehiculosConGPS / estadisticas.totalVehiculos) * 100).toFixed(1) 
    : "0"

  const porcentajeDocumentos = estadisticas.totalVehiculos > 0 
    ? ((estadisticas.documentosVigentes / estadisticas.totalVehiculos) * 100).toFixed(1) 
    : "0"

  // Calcular documentos próximos a vencer (30 días)
  const documentosProximosVencer = reportes.filter(v => {
    const fechaSOAT = v.soatVencimiento !== "N/A" ? new Date(v.soatVencimiento) : null
    const fechaITV = v.itvVencimiento !== "N/A" ? new Date(v.itvVencimiento) : null
    const hoy = new Date()
    const treintaDias = new Date(hoy.getTime() + (30 * 24 * 60 * 60 * 1000))

    return (fechaSOAT && fechaSOAT <= treintaDias) || (fechaITV && fechaITV <= treintaDias)
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flota Total</CardTitle>
          <Truck className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.totalVehiculos}</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.vehiculosActivos} activos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Operatividad</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{porcentajeOperativo}%</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.vehiculosMantenimiento} en mantenimiento
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cobertura GPS</CardTitle>
          <Satellite className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{porcentajeGPS}%</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.vehiculosConGPS} con GPS activo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documentación</CardTitle>
          <Calendar className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{porcentajeDocumentos}%</div>
          <p className="text-xs text-muted-foreground">
            {documentosProximosVencer} próximos a vencer
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estado de la Flota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Activos</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.vehiculosActivos}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">En mantenimiento</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.vehiculosMantenimiento}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm">Inactivos</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.vehiculosInactivos}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Averiados</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.vehiculosAveriados}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Rendimiento de Flota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Total viajes este mes</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.totalViajesMes.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">Distancia recorrida</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.distanciaTotal.toLocaleString()} km</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Promedio por vehículo</span>
              </div>
              <div className="text-lg font-semibold">
                {estadisticas.totalVehiculos > 0 ? (estadisticas.totalViajesMes / estadisticas.totalVehiculos).toFixed(1) : 0} viajes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {documentosProximosVencer > 0 && (
        <Card className="md:col-span-2 lg:col-span-4 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              Alerta: Documentos Próximos a Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              {documentosProximosVencer} vehículo(s) tienen documentos que vencen en los próximos 30 días. 
              Revise la tabla para más detalles y gestione las renovaciones correspondientes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}