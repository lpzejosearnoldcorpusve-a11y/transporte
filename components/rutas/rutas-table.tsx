"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Ruta } from "@/types/ruta"
import { RutaRowActions } from "./ruta-row-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RutaMapPreview } from "./ruta-map-preview"
import { Map } from "lucide-react"

interface RutasTableProps {
  rutas: Ruta[]
  onEdit: (ruta: Ruta) => void
  onDelete: (id: string) => void
}

const estadoColors = {
  planificada: "bg-blue-100 text-blue-800",
  en_curso: "bg-yellow-100 text-yellow-800",
  completada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
}

const estadoLabels = {
  planificada: "Planificada",
  en_curso: "En Curso",
  completada: "Completada",
  cancelada: "Cancelada",
}

export function RutasTable({ rutas, onEdit, onDelete }: RutasTableProps) {
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Distancia</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Fecha Salida</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Mapa</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rutas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No hay rutas registradas
                </TableCell>
              </TableRow>
            ) : (
              rutas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell className="font-medium">{ruta.nombre}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{ruta.origen}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{ruta.destino}</TableCell>
                  <TableCell>{ruta.distanciaKm ? `${ruta.distanciaKm} km` : "-"}</TableCell>
                  <TableCell>
                    {ruta.duracionMinutos
                      ? `${Math.floor(Number(ruta.duracionMinutos) / 60)}h ${Number(ruta.duracionMinutos) % 60}m`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {ruta.fechaSalida
                      ? format(new Date(ruta.fechaSalida), "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={estadoColors[ruta.estado]}>{estadoLabels[ruta.estado]}</Badge>
                  </TableCell>
                  <TableCell>
                    {ruta.origenLat && ruta.origenLng && ruta.destinoLat && ruta.destinoLng ? (
                      <Button variant="outline" size="sm" onClick={() => setSelectedRuta(ruta)} className="gap-2">
                        <Map className="h-4 w-4" />
                        Ver Mapa
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin coordenadas</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <RutaRowActions ruta={ruta} onEdit={onEdit} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRuta} onOpenChange={() => setSelectedRuta(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedRuta?.nombre}</DialogTitle>
          </DialogHeader>
          {selectedRuta && (
            <RutaMapPreview
              origen={selectedRuta.origen}
              destino={selectedRuta.destino}
              origenLat={selectedRuta.origenLat != null ? Number(selectedRuta.origenLat) : undefined}
              origenLng={selectedRuta.origenLng != null ? Number(selectedRuta.origenLng) : undefined}
              destinoLat={selectedRuta.destinoLat != null ? Number(selectedRuta.destinoLat) : undefined}
              destinoLng={selectedRuta.destinoLng != null ? Number(selectedRuta.destinoLng) : undefined}
              distanciaKm={selectedRuta.distanciaKm != null ? Number(selectedRuta.distanciaKm) : undefined}
              duracionMinutos={selectedRuta.duracionMinutos != null ? Number(selectedRuta.duracionMinutos) : undefined}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
