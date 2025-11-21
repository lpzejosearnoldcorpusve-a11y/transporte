"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReporteRuta } from "@/types/reportes"
import { MapPin, Clock, Truck, Route } from "lucide-react"

interface ReporteRutasTablaProps {
  reportes: ReporteRuta[]
  isLoading: boolean
}

const getEstadoBadge = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "activa":
      return <Badge className="bg-green-500 text-white">Activa</Badge>
    case "completada":
      return <Badge className="bg-blue-500 text-white">Completada</Badge>
    case "cancelada":
      return <Badge variant="danger">Cancelada</Badge>
    case "pendiente":
      return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
    default:
      return <Badge variant="default">{estado}</Badge>
  }
}

const formatDuracion = (minutos: number) => {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`
}

export function ReporteRutasTabla({ reportes, isLoading }: ReporteRutasTablaProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Reportes de Rutas
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
            <Route className="h-5 w-5" />
            Reportes de Rutas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No se encontraron rutas con los filtros aplicados
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Reportes de Rutas ({reportes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ruta</TableHead>
              <TableHead>Origen - Destino</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Distancia</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Fecha Salida</TableHead>
              <TableHead>Conductor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportes.map((ruta) => (
              <TableRow key={ruta.id}>
                <TableCell className="font-medium">{ruta.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {ruta.origen} → {ruta.destino}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getEstadoBadge(ruta.estado)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span>{ruta.vehiculoPlaca}</span>
                  </div>
                </TableCell>
                <TableCell>{ruta.distanciaKm} km</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{formatDuracion(ruta.duracionMinutos)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {ruta.fechaSalida ? new Date(ruta.fechaSalida).toLocaleDateString("es-ES") : "N/A"}
                </TableCell>
                <TableCell>{ruta.conductorNombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}