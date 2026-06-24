"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useFacturas, useDeleteFactura } from "@/hooks/use-facturas"
import { FacturaForm } from "./factura-form"
import type { Factura } from "@/types/factura"

const ESTADO_COLORS = {
  pendiente: "bg-yellow-100 text-yellow-800",
  procesada: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
}

export function FacturasList() {
  const { data: facturas, isLoading } = useFacturas()
  const deleteFactura = useDeleteFactura()
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (isLoading) {
    return <div className="text-center py-8">Cargando facturas...</div>
  }

  const handleDelete = (id: string) => {
    deleteFactura.mutate(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Facturas</h2>
        {selectedFactura && (
          <Button variant="outline" onClick={() => setSelectedFactura(null)}>
            Nueva Factura
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedFactura ? "Editar Factura" : "Nueva Factura"}</h3>
          <FacturaForm factura={selectedFactura || undefined} onSuccess={() => setSelectedFactura(null)} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Lista de Facturas</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturas && facturas.length > 0 ? (
                  facturas.map((factura) => (
                    <TableRow key={factura.id}>
                      <TableCell>{factura.numeroFactura || "-"}</TableCell>
                      <TableCell>{factura.categoria}</TableCell>
                      <TableCell>{factura.proveedor || "-"}</TableCell>
                      <TableCell>{new Date(factura.fechaFactura).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={ESTADO_COLORS[factura.estado as keyof typeof ESTADO_COLORS]}>
                          {factura.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFactura(factura)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(factura.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No hay facturas registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Eliminar Factura</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar esta factura? Esta acción no puede deshacerse.
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
