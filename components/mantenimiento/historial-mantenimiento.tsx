"use client"

import { motion } from "framer-motion"
import { Calendar, DollarSign, FileText, Wrench } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Mantenimiento } from "@/types/mantenimiento"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface HistorialMantenimientoProps {
  mantenimientos: Mantenimiento[]
}

export function HistorialMantenimiento({ mantenimientos }: HistorialMantenimientoProps) {
  if (mantenimientos.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">No hay historial de mantenimientos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {mantenimientos.map((mantenimiento, index) => (
        <motion.div
          key={mantenimiento.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <div className="flex">
              {/* Línea de tiempo */}
              <div className="flex w-24 flex-col items-center bg-forest-green-50 p-4">
                <div className="rounded-full bg-vibrant-orange-500 p-2">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div className="mt-2 h-full w-0.5 bg-gray-300" />
              </div>

              {/* Contenido */}
              <div className="flex-1 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-forest-green-900">
                      Mantenimiento #{mantenimiento.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">{mantenimiento.nombreTaller || "Taller no especificado"}</p>
                  </div>
                  <Badge className={mantenimiento.estado === "completado" ? "bg-green-500" : "bg-vibrant-orange-500"}>
                    {mantenimiento.estado === "completado" ? "Completado" : "En Proceso"}
                  </Badge>
                </div>

                {/* Fechas */}
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Inicio:</span>
                    <span className="font-medium">
                      {format(new Date(mantenimiento.fechaInicio), "PPP", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  {mantenimiento.fechaFin && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Fin:</span>
                      <span className="font-medium">
                        {format(new Date(mantenimiento.fechaFin), "PPP", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {mantenimiento.descripcionProblema && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{mantenimiento.descripcionProblema}</p>
                  </div>
                )}

                {/* Trabajos realizados */}
                {mantenimiento.trabajosRealizados && (
                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4" />
                      Trabajos Realizados
                    </h4>
                    <p className="whitespace-pre-line text-sm text-gray-700">{mantenimiento.trabajosRealizados}</p>
                  </div>
                )}

                {/* Partes cambiadas */}
                {(mantenimiento.partesInteriores?.length || mantenimiento.partesExteriores?.length) && (
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    {(mantenimiento.partesInteriores?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">Partes Interiores</h4>
                        <div className="flex flex-wrap gap-2">
                          {mantenimiento.partesInteriores?.map((parte, i) => (
                            <Badge key={i} variant="default">
                              {parte}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(mantenimiento.partesExteriores?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">Partes Exteriores</h4>
                        <div className="flex flex-wrap gap-2">
                          {mantenimiento.partesExteriores?.map((parte, i) => (
                            <Badge key={i} variant="default">
                              {parte}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Costo */}
                {mantenimiento.costoTotal && (
                  <div className="flex items-center gap-2 text-lg font-bold text-forest-green-700">
                    <DollarSign className="h-5 w-5" />
                    {mantenimiento.moneda} {mantenimiento.costoTotal}
                  </div>
                )}

                {/* Fichas */}
                {mantenimiento.fichasUrls && mantenimiento.fichasUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-semibold">Fichas de Mantenimiento</h4>
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                      {mantenimiento.fichasUrls.map((url, i) => (
                        <img
                          key={i}
                          src={url || "/placeholder.svg"}
                          alt={`Ficha ${i + 1}`}
                          className="h-20 w-full cursor-pointer rounded-lg object-cover transition-transform hover:scale-105"
                          onClick={() => window.open(url, "_blank")}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
