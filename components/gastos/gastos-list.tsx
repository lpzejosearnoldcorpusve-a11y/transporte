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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useGastos, useDeleteGasto } from "@/hooks/use-gastos"
import { GastoForm } from "./gasto-form"
import type { Gasto } from "@/types/gasto"

export function GastosList() {
  const { data: gastos, isLoading } = useGastos()
  const deleteGasto = useDeleteGasto()
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (isLoading) {
    return <div className="text-center py-8">Cargando gastos...</div>
  }

  const handleDelete = (id: string) => {
    deleteGasto.mutate(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Gastos</h2>
        {selectedGasto && (
          <Button variant="outline" onClick={() => setSelectedGasto(null)}>
            Nuevo Gasto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedGasto ? "Editar Gasto" : "Nuevo Gasto"}</h3>
          <GastoForm gasto={selectedGasto || undefined} onSuccess={() => setSelectedGasto(null)} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Lista de Gastos</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastos && gastos.length > 0 ? (
                  gastos.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell>{gasto.tipoGasto}</TableCell>
                      <TableCell>{Number(gasto.monto).toFixed(2)}</TableCell>
                      <TableCell>{gasto.moneda}</TableCell>
                      <TableCell>{new Date(gasto.fecha).toLocaleDateString()}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedGasto(gasto)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(gasto.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay gastos registrados
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
          <AlertDialogTitle>Eliminar Gasto</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar este gasto? Esta acción no puede deshacerse.
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
