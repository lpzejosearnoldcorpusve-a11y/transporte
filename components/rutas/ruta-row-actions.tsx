"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Ruta } from "@/types/ruta"

interface RutaRowActionsProps {
  ruta: Ruta
  onEdit: (ruta: Ruta) => void
  onDelete: (id: string) => void
}

export function RutaRowActions({ ruta, onEdit, onDelete }: RutaRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(ruta)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (confirm("¿Estás seguro de eliminar esta ruta?")) {
            onDelete(ruta.id)
          }
        }}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
