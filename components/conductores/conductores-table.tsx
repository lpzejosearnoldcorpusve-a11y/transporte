"use client"

import type { Conductor } from "@/types/conductor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ConductorRowActions } from "./conductor-row-actions"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

interface ConductoresTableProps {
  conductores: Conductor[]
  onEdit: (conductor: Conductor) => void
  onDelete: (id: string) => void
}

export function ConductoresTable({ conductores, onEdit, onDelete }: ConductoresTableProps) {
  const getLicenciaStatus = (vencimiento: Date | string) => {
    const fecha = new Date(vencimiento)
    const diasRestantes = differenceInDays(fecha, new Date())

    if (diasRestantes < 0) {
      return { label: "Vencida", variant: "danger" as const } // Cambiado de "destructive" a "danger"
    } else if (diasRestantes <= 30) {
      return { label: "Por vencer", variant: "warning" as const }
    }
    return { label: "Vigente", variant: "success" as const }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>CI</TableHead>
            <TableHead>Licencia</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No hay conductores registrados
              </TableCell>
            </TableRow>
          ) : (
            conductores.map((conductor) => {
              const status = getLicenciaStatus(conductor.vencimientoLicencia)
              return (
                <TableRow key={conductor.id}>
                  <TableCell className="font-medium">
                    {conductor.nombre} {conductor.apellido}
                  </TableCell>
                  <TableCell>{conductor.ci}</TableCell>
                  <TableCell>{conductor.licencia}</TableCell>
                  <TableCell>
                    <Badge variant="default">{conductor.categoria}</Badge> {/* Cambiado de "outline" a "default" */}
                  </TableCell>
                  <TableCell>
                    {format(new Date(conductor.vencimientoLicencia), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>{conductor.telefono || "-"}</TableCell>
                  <TableCell className="text-right">
                    <ConductorRowActions conductor={conductor} onEdit={onEdit} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}