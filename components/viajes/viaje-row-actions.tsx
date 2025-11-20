"use client"

import type { Viaje } from "@/types/viaje"
import { useViajeMutations } from "@/hooks/use-viaje-mutations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, FileText, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface ViajeDatos extends Viaje {
  vehiculos?: { placa: string; marca: string } | null
  conductores?: { nombre: string; apellido: string } | null
}

interface ViajeRowActionsProps {
  viaje: ViajeDatos
  onRefresh: () => void
}

export function ViajeRowActions({ viaje, onRefresh }: ViajeRowActionsProps) {
  const { generarPDF, eliminarViaje } = useViajeMutations(onRefresh)

  console.log("🔍 [ViajeRowActions] Datos del viaje:", {
    id: viaje.id,
    numeroViaje: viaje.numeroViaje,
    tieneId: !!viaje.id
  })

  const handleGenerarPDF = async () => {
    console.log("🔄 [Componente] Iniciando generación de PDF para viaje:", viaje.id)
    console.log("📋 [Componente] Tipo de viaje.id:", typeof viaje.id)
    console.log("📋 [Componente] Valor de viaje.id:", viaje.id)
    
    if (!viaje.id) {
      console.error("❌ [Componente] viaje.id es undefined o vacío")
      return
    }

    try {
      await generarPDF(viaje.id)
      console.log("✅ [Componente] PDF generado exitosamente")
    } catch (error) {
      console.error("💥 [Componente] Error generando PDF:", error)
    }
  }

  const handleDelete = async () => {
    if (!viaje.id) {
      console.error("❌ [Componente] No se puede eliminar - viaje.id es undefined")
      return
    }

    if (confirm("¿Estás seguro de que deseas eliminar este viaje?")) {
      try {
        await eliminarViaje(viaje.id)
      } catch (error) {
        console.error("Error eliminando viaje:", error)
      }
    }
  }

  // Si no hay ID, deshabilitar las acciones
  const hasValidId = !!viaje.id

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={handleGenerarPDF} 
            disabled={!hasValidId}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            {hasValidId ? "Generar Hoja de Ruta" : "ID no disponible"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete} 
            disabled={!hasValidId}
            className="flex items-center gap-2 cursor-pointer text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            {hasValidId ? "Eliminar" : "No se puede eliminar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}