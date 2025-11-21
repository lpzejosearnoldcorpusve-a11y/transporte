"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReporteGPS } from "@/types/reportes"
import { Satellite, AlertTriangle, Gauge, Wifi, WifiOff, MapPin } from "lucide-react"

interface ReporteGPSEstadisticasProps {
  reportes: ReporteGPS[]
}

export function ReporteGPSEstadisticas({ reportes }: ReporteGPSEstadisticasProps) {
  const estadisticas = {
    totalDispositivos: reportes.length,
    dispositivosConectados: reportes.filter((r) => !r.alertas.gpsDesconectado).length,
    dispositivosDesconectados: reportes.filter((r) => r.alertas.gpsDesconectado).length,
    totalAlertas: reportes.reduce((sum, r) => {
      return sum + Object.values(r.alertas).filter(Boolean).length
    }, 0),
    velocidadPromedioFlota: reportes.length > 0 
      ? reportes.reduce((sum, r) => sum + r.velocidadPromedio, 0) / reportes.length 
      : 0,
    velocidadMaximaFlota: Math.max(...reportes.map(r => r.velocidadMaxima), 0),
    vehiculosConGPS: reportes.filter(r => r.vehiculo_placa !== "Sin vehículo").length,
  }

  const porcentajeConectividad = estadisticas.totalDispositivos > 0 
    ? ((estadisticas.dispositivosConectados / estadisticas.totalDispositivos) * 100).toFixed(1) 
    : "0"

  const alertasPorTipo = {
    excesoVelocidad: reportes.filter(r => r.alertas.excesoVelocidad).length,
    combustibleBajo: reportes.filter(r => r.alertas.combustibleBajo).length,
    gpsDesconectado: reportes.filter(r => r.alertas.gpsDesconectado).length,
    fueraDeRuta: reportes.filter(r => r.alertas.fueraDeRuta).length,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dispositivos GPS</CardTitle>
          <Satellite className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.totalDispositivos}</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.vehiculosConGPS} con vehículo asignado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conectividad</CardTitle>
          <Wifi className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{porcentajeConectividad}%</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.dispositivosConectados} de {estadisticas.totalDispositivos} conectados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Velocidad Promedio</CardTitle>
          <Gauge className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.velocidadPromedioFlota.toFixed(1)} km/h</div>
          <p className="text-xs text-muted-foreground">
            Máxima: {estadisticas.velocidadMaximaFlota} km/h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.totalAlertas}</div>
          <p className="text-xs text-muted-foreground">
            Requieren atención inmediata
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estado de Conexión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-sm">Conectados</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.dispositivosConectados}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-sm">Desconectados</span>
              </div>
              <div className="text-lg font-semibold">{estadisticas.dispositivosDesconectados}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Alertas por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Exceso de velocidad</span>
              <span className="font-semibold text-red-600">{alertasPorTipo.excesoVelocidad}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">GPS desconectado</span>
              <span className="font-semibold text-red-600">{alertasPorTipo.gpsDesconectado}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Combustible bajo</span>
              <span className="font-semibold text-orange-600">{alertasPorTipo.combustibleBajo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fuera de ruta</span>
              <span className="font-semibold text-yellow-600">{alertasPorTipo.fueraDeRuta}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}