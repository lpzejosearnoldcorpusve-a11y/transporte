"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Route, Eye, MapPin } from "lucide-react"

interface Viaje {
  id: string
  numeroViaje: string
  vehiculoId: string
  conductorId: string
  producto: string
  cantidad: number
  lugarCarga: string
  lugarDescarga: string
  estado: string
  vehiculo?: {
    id: string
    placa: string
    marca: string
  }
  conductor?: {
    id: string
    nombre: string
    apellido: string
  }
}

interface DashboardViajesCursoProps {
  viajesEnTransito: Viaje[]
  onVerMapa?: (viaje: Viaje) => void
  onVerRuta?: (viaje: Viaje) => void
}

function getEstadoBadge(estado: string) {
  switch (estado) {
    case "planificado":
      return <Badge variant="default">Planificado</Badge>
    case "en_transito":
      return <Badge className="bg-blue-100 text-blue-800">En Tránsito</Badge>
    case "completado":
      return <Badge className="bg-green-100 text-green-800">Completado</Badge>
    case "cancelado":
      return <Badge variant="danger">Cancelado</Badge>
    default:
      return <Badge variant="default">Desconocido</Badge>
  }
}

export function DashboardViajesCurso({ viajesEnTransito, onVerMapa, onVerRuta }: DashboardViajesCursoProps) {
 
  const getProgresoViaje = (viaje: Viaje): number => {
    
    return Math.floor(Math.random() * 80) + 10 // Entre 10% y 90%
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-vibrant-orange-600" />
            Viajes en Curso
          </CardTitle>
          <CardDescription>
            {viajesEnTransito.length} viajes actualmente en tránsito
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viajesEnTransito.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <Route className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No hay viajes en tránsito actualmente</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32">Vehículo</TableHead>
                    <TableHead className="min-w-32">Conductor</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="min-w-40">Ruta</TableHead>
                    <TableHead className="min-w-24">Progreso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right min-w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viajesEnTransito.slice(0, 8).map((viaje, index) => {
                    const progreso = getProgresoViaje(viaje)

                    return (
                      <motion.tr
                        key={viaje.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-forest-green-900">
                              {viaje.vehiculo?.placa || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {viaje.vehiculo?.marca}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {viaje.conductor?.nombre} {viaje.conductor?.apellido}
                            </span>
                            <span className="text-sm text-gray-500">
                              #{viaje.numeroViaje}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="default" className="font-medium">
                            {viaje.producto}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col max-w-40">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="truncate" title={viaje.lugarCarga}>
                                {viaje.lugarCarga}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-vibrant-orange-500">
                              <div className="w-4 h-px bg-gray-300"></div>
                              <span className="text-xs">→</span>
                              <div className="w-4 h-px bg-gray-300"></div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="truncate" title={viaje.lugarDescarga}>
                                {viaje.lugarDescarga}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 min-w-20">
                            <Progress value={progreso} className="flex-1" />
                            <span className="text-sm font-medium w-8 text-right">
                              {progreso}%
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {getEstadoBadge(viaje.estado)}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onVerMapa?.(viaje)}
                              className="h-8 px-2"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mapa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onVerRuta?.(viaje)}
                              className="h-8 px-2"
                            >
                              <Route className="h-3 w-3 mr-1" />
                              Ruta
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}