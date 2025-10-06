"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VehiculoStatusBadge } from "./vehiculo-status-badge"
import { VehiculoRowActions } from "./vehiculo-row-actions"
import type { Vehiculo } from "@/types/vehiculo"

interface VehiculosTableProps {
  vehiculos: Vehiculo[]
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (vehiculoId: string) => void
}

export function VehiculosTable({ vehiculos, onEdit, onDelete }: VehiculosTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Marca/Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Capacidad (L)</TableHead>
            <TableHead>SOAT</TableHead>
            <TableHead>ITV</TableHead>
            <TableHead>Permiso</TableHead>
            <TableHead>GPS</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehiculos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-gray-500">
                No hay vehículos registrados
              </TableCell>
            </TableRow>
          ) : (
            vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id}>
                <TableCell className="font-bold text-forest-green-700">{vehiculo.placa}</TableCell>
                <TableCell>{vehiculo.marca}</TableCell>
                <TableCell>{vehiculo.anio || "-"}</TableCell>
                <TableCell>
                  <Badge variant="default">{vehiculo.tipoVehiculo || "cisterna"}</Badge>
                </TableCell>
                <TableCell>{vehiculo.capacidadLitros || "-"}</TableCell>
                <TableCell>
                  <VehiculoStatusBadge date={vehiculo.vencSoat} type="soat" />
                </TableCell>
                <TableCell>
                  <VehiculoStatusBadge date={vehiculo.vencItv} type="itv" />
                </TableCell>
                <TableCell>
                  <VehiculoStatusBadge date={vehiculo.vencPermiso} type="permiso" />
                </TableCell>
                <TableCell>
                  {vehiculo.gpsActivo ? (
                    <Badge variant="success" className="text-xs">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      Inactivo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={vehiculo.estado === "activo" ? "success" : "default"}>
                    {vehiculo.estado || "activo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <VehiculoRowActions vehiculo={vehiculo} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
