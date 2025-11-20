"use client"

import type { Viaje } from "@/types/viaje"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ViajeRowActions } from "./viaje-row-actions"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface ViajeDatos extends Viaje {
  vehiculos?: { placa: string; marca: string } | null
  conductores?: { nombre: string; apellido: string } | null
}

interface ViajasTableProps {
  viajes: ViajeDatos[]
  onRefresh: () => void
}

const estadoConfig = {
  planificado: { color: "bg-blue-100 text-blue-800", label: "Planificado" },
  en_transito: { color: "bg-yellow-100 text-yellow-800", label: "En Tránsito" },
  completado: { color: "bg-green-100 text-green-800", label: "Completado" },
  cancelado: { color: "bg-red-100 text-red-800", label: "Cancelado" },
}

export function ViajasTable({ viajes, onRefresh }: ViajasTableProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Para debug - verifica las keys
  console.log("Viajes data:", viajes?.map(v => ({ id: v.id, numeroViaje: v.numeroViaje })))

  return (
    <motion.div
      className="rounded-lg border border-gray-200 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-forest-green-50">
            <TableHead className="text-forest-green-900">Viaje</TableHead>
            <TableHead className="text-forest-green-900">Vehículo</TableHead>
            <TableHead className="text-forest-green-900">Conductor</TableHead>
            <TableHead className="text-forest-green-900">Producto</TableHead>
            <TableHead className="text-forest-green-900">Cantidad</TableHead>
            <TableHead className="text-forest-green-900">Ruta</TableHead>
            <TableHead className="text-forest-green-900">Estado</TableHead>
            <TableHead className="text-forest-green-900">Hace</TableHead>
            <TableHead className="text-right text-forest-green-900">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {viajes?.map((viaje, index) => {
            // CORRECCIÓN: Key más robusta
            const uniqueKey = viaje.id || `viaje-${viaje.numeroViaje}-${index}`
            
            const estado = estadoConfig[viaje.estado as keyof typeof estadoConfig] || 
                          { color: "bg-gray-100 text-gray-800", label: "Desconocido" }
            
            return (
              <motion.tr 
                key={uniqueKey} // CORRECCIÓN: Usar key robusta
                variants={rowVariants} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-forest-green-900">{viaje.numeroViaje}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{viaje.vehiculos?.placa || "N/A"}</div>
                    <div className="text-gray-500">{viaje.vehiculos?.marca || "Sin marca"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {viaje.conductores?.nombre || "N/A"} {viaje.conductores?.apellido || ""}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{viaje.producto}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {viaje.cantidad} {viaje.unidad || "litros"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs">
                    <div className="text-gray-700">{viaje.lugarCarga}</div>
                    <div className="text-vibrant-orange-500">→</div>
                    <div className="text-gray-700">{viaje.lugarDescarga}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={estado.color}>{estado.label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {(() => {
                    const date = new Date(viaje.creadoEn);
                    return isNaN(date.getTime()) ? "Fecha inválida" : formatDistanceToNow(date, { locale: es, addSuffix: true });
                  })()}
                </TableCell>
                <TableCell className="text-right">
                  <ViajeRowActions viaje={viaje} onRefresh={onRefresh} />
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </motion.div>
  )
}