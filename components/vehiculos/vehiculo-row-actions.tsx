"use client"

import { FC } from "react"
import { Vehiculo } from "@/types/vehiculo"
import { Button } from "@/components/ui/button"

interface VehiculoRowActionsProps {
  vehiculo: Vehiculo
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (vehiculoId: string) => void
}

export const VehiculoRowActions: FC<VehiculoRowActionsProps> = ({ vehiculo, onEdit, onDelete }) => {
  // Si no tiene id, no se muestran las acciones
  if (!vehiculo.id) return null

  return (
    <div className="flex gap-2 justify-end">
      <Button size="sm" variant="outline" onClick={() => onEdit(vehiculo)}>
        Editar
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onDelete(vehiculo.id!)}>
        Eliminar
      </Button>
    </div>
  )
}
