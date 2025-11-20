"use client"

import type { Viaje } from "@/types/viaje"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, Truck, User, Package, MapPin } from "lucide-react"

interface ViajeDatos extends Viaje {
  vehiculos?: { placa: string; marca: string } | null
  conductores?: { nombre: string; apellido: string } | null
}

interface ViajeCardProps {
  viaje: ViajeDatos
}

const estadoConfig = {
  planificado: { color: "bg-blue-100 text-blue-800", label: "Planificado" },
  en_transito: { color: "bg-yellow-100 text-yellow-800", label: "En Tránsito" },
  completado: { color: "bg-green-100 text-green-800", label: "Completado" },
  cancelado: { color: "bg-red-100 text-red-800", label: "Cancelado" },
}

export function ViajeCard({ viaje }: ViajeCardProps) {
  const estado = estadoConfig[viaje.estado as keyof typeof estadoConfig] ?? { color: "bg-gray-100 text-gray-800", label: "Desconocido" }

  return (
    <motion.div whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }} transition={{ duration: 0.2 }}>
      <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-vibrant-orange-500">
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-forest-green-900">{viaje.numeroViaje}</h3>
              <p className="text-sm text-gray-500">{viaje.numeroFactura}</p>
            </div>
            <Badge className={estado.color}>{estado.label}</Badge>
          </div>

          {/* Producto y Cantidad */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-vibrant-orange-500" />
            <span className="text-sm font-medium">
              {viaje.cantidad} {viaje.unidad} de {viaje.producto}
            </span>
          </div>

          {/* Vehículo */}
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-forest-green-900" />
            <span className="text-sm">
              {viaje.vehiculos?.placa} - {viaje.vehiculos?.marca}
            </span>
          </div>

          {/* Conductor */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-forest-green-900" />
            <span className="text-sm">
              {viaje.conductores?.nombre} {viaje.conductores?.apellido}
            </span>
          </div>

          {/* Ruta */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-vibrant-orange-500" />
            <span className="text-sm">
              {viaje.lugarCarga} → {viaje.lugarDescarga}
            </span>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-forest-green-900" />
            <span className="text-sm">{new Date(viaje.fechaInicio).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
