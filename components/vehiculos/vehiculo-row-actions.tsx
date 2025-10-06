"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Vehiculo } from "@/types/vehiculo"

interface VehiculoRowActionsProps {
  vehiculo: Vehiculo
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (vehiculoId: string) => void
}

export function VehiculoRowActions({ vehiculo, onEdit, onDelete }: VehiculoRowActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(vehiculo)} className="h-8 w-8 p-0">
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(vehiculo.id)}
        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
