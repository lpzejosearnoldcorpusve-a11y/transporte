"use client"

import type { DocumentoConductor } from "@/types/documento-conductor"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react"

interface DocumentoRowActionsProps {
  documento: DocumentoConductor
  onEdit: (documento: DocumentoConductor) => void
  onDelete: (id: string) => void
  onValidate: (id: string) => void
}

export function DocumentoRowActions({ documento, onEdit, onDelete, onValidate }: DocumentoRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!documento.validado && (
          <DropdownMenuItem onClick={() => onValidate(documento.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Validar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(documento)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(documento.id)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
