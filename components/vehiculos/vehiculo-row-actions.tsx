"use client"

import { Edit, Trash2, Eye, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Vehiculo } from "@/types/vehiculo"
import { useState } from "react"

interface VehiculoRowActionsProps {
  vehiculo: Vehiculo
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (vehiculoId: string) => void
  onView?: (vehiculo: Vehiculo) => void
}

export function VehiculoRowActions({ vehiculo, onEdit, onDelete, onView }: VehiculoRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(vehiculo.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error al eliminar:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <TooltipProvider>
        <div className="flex justify-end gap-1">
          {/* Versión Botones Individuales (Desktop) */}
          <div className="hidden md:flex gap-1">
            {onView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(vehiculo)}
                    className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs font-medium">Ver detalles</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(vehiculo)}
                  className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:scale-105"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs font-medium">Editar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-8 w-8 p-0 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs font-medium">Eliminar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Versión Menú Dropdown (Mobile) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onView && (
                  <>
                    <DropdownMenuItem onClick={() => onView(vehiculo)} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Ver detalles</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onEdit(vehiculo)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </TooltipProvider>

      {/* Diálogo de Confirmación de Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo{" "}
              <span className="font-semibold text-slate-900">
                {vehiculo.placa || vehiculo.marca}
              </span>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}