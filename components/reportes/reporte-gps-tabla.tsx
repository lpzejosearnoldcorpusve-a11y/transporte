"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReporteGPS } from "@/types/reportes"
import { MapPin, Gauge, AlertTriangle, Truck, Satellite } from "lucide-react"

interface ReporteGPSTablaProps {
  reportes: ReporteGPS[]
  isLoading: boolean
}

const getConexionBadge = (conectado: boolean) => {
  return conectado ? (
    <Badge className="bg-green-500 text-white">Conectado</Badge>
  ) : (
    <Badge variant="danger">Desconectado</Badge>
  )
}

const getAlertaBadge = (alertas: any) => {
  const alertasActivas = Object.values(alertas).filter(Boolean).length
  if (alertasActivas === 0) {
    return <Badge className="bg-green-500 text-white">Sin alertas</Badge>
  }
  return <Badge className="bg-red-500 text-white">{alertasActivas} alerta(s)</Badge>
}

const formatUbicacion = (lat: number, lng: number) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

export function ReporteGPSTabla({ reportes, isLoading }: ReporteGPSTablaProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Reportes GPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reportes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Reportes GPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No se encontraron dispositivos GPS
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="h-5 w-5" />
          Reportes GPS ({reportes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IMEI</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Ubicación Actual</TableHead>
              <TableHead>Velocidades</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Alertas</TableHead>
              <TableHead>Última Señal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportes.map((reporte) => (
              <TableRow key={reporte.dispositivo_id}>
                <TableCell className="font-medium font-mono text-sm">
                  {reporte.imei}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span>{reporte.vehiculo_placa}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-mono">
                      {formatUbicacion(
                        reporte.ubicacionActual.latitud,
                        reporte.ubicacionActual.longitud
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">Prom: {reporte.velocidadPromedio} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-3 w-3 text-red-500" />
                      <span className="text-sm">Máx: {reporte.velocidadMaxima} km/h</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getConexionBadge(!reporte.alertas.gpsDesconectado)}
                </TableCell>
                <TableCell>
                  {getAlertaBadge(reporte.alertas)}
                  {Object.entries(reporte.alertas).some(([_, value]) => value) && (
                    <div className="mt-1 space-y-1">
                      {reporte.alertas.excesoVelocidad && (
                        <div className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Exceso velocidad
                        </div>
                      )}
                      {reporte.alertas.combustibleBajo && (
                        <div className="text-xs text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Combustible bajo
                        </div>
                      )}
                      {reporte.alertas.gpsDesconectado && (
                        <div className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          GPS desconectado
                        </div>
                      )}
                      {reporte.alertas.fueraDeRuta && (
                        <div className="text-xs text-yellow-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Fuera de ruta
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(reporte.ubicacionActual.timestamp).toLocaleString("es-ES")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}