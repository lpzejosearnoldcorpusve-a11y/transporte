"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReporteVehiculo } from "@/types/reportes"
import { Truck, Calendar, CheckCircle, XCircle, Satellite, User } from "lucide-react"

interface ReporteVehiculosTablaProps {
  reportes: ReporteVehiculo[]
  isLoading: boolean
}

const getEstadoBadge = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "activo":
      return <Badge className="bg-green-500 text-white">Activo</Badge>
    case "inactivo":
      return <Badge variant="warning">Inactivo</Badge>
    case "mantenimiento":
      return <Badge className="bg-orange-500 text-white">Mantenimiento</Badge>
    case "averiado":
      return <Badge variant="danger">Averiado</Badge>
    default:
      return <Badge variant="default">{estado}</Badge>
  }
}

const getDocumentosBadge = (vigente: boolean) => {
  return vigente ? (
    <Badge className="bg-green-500 text-white">
      <CheckCircle className="h-3 w-3 mr-1" />
      Vigente
    </Badge>
  ) : (
    <Badge variant="danger">
      <XCircle className="h-3 w-3 mr-1" />
      Vencido
    </Badge>
  )
}

const formatFecha = (fecha: string) => {
  if (fecha === "N/A") return "N/A"
  return new Date(fecha).toLocaleDateString("es-ES")
}

const getDiasParaVencer = (fecha: string) => {
  if (fecha === "N/A") return null
  const fechaVencimiento = new Date(fecha)
  const hoy = new Date()
  const diferencia = fechaVencimiento.getTime() - hoy.getTime()
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))
  return dias
}

export function ReporteVehiculosTabla({ reportes, isLoading }: ReporteVehiculosTablaProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Reportes de Vehículos
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
            <Truck className="h-5 w-5" />
            Reportes de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No se encontraron vehículos con los filtros aplicados
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Reportes de Vehículos ({reportes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Marca/Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>GPS</TableHead>
              <TableHead>Documentos</TableHead>
              <TableHead>SOAT</TableHead>
              <TableHead>ITV</TableHead>
              <TableHead>Viajes/Mes</TableHead>
              <TableHead>Conductor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportes.map((vehiculo) => {
              const diasSOAT = getDiasParaVencer(vehiculo.soatVencimiento)
              const diasITV = getDiasParaVencer(vehiculo.itvVencimiento)
              
              return (
                <TableRow key={vehiculo.id}>
                  <TableCell className="font-medium">{vehiculo.placa}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehiculo.marca}</div>
                      <div className="text-sm text-gray-500">{vehiculo.tipoVehiculo}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(vehiculo.estado)}</TableCell>
                  <TableCell>
                    {vehiculo.gpsActivo ? (
                      <Badge className="bg-green-500 text-white">
                        <Satellite className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getDocumentosBadge(vehiculo.documentosVigentes)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{formatFecha(vehiculo.soatVencimiento)}</div>
                      {diasSOAT !== null && (
                        <div className={`text-xs ${diasSOAT <= 30 ? 'text-red-600' : diasSOAT <= 60 ? 'text-orange-600' : 'text-green-600'}`}>
                          {diasSOAT > 0 ? `${diasSOAT} días` : `Vencido hace ${Math.abs(diasSOAT)} días`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{formatFecha(vehiculo.itvVencimiento)}</div>
                      {diasITV !== null && (
                        <div className={`text-xs ${diasITV <= 30 ? 'text-red-600' : diasITV <= 60 ? 'text-orange-600' : 'text-green-600'}`}>
                          {diasITV > 0 ? `${diasITV} días` : `Vencido hace ${Math.abs(diasITV)} días`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{vehiculo.viajesMes}</div>
                      <div className="text-xs text-gray-500">{vehiculo.distanciaRecorrida} km</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{vehiculo.conductorActual}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}