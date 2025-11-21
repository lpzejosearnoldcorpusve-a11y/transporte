"use client"

import type { Viaje } from "@/types/viaje"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Truck, 
  User, 
  Package, 
  MapPin,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Navigation,
  Clock
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ViajeDatos extends Viaje {
  vehiculos?: { placa: string; marca: string; tipoVehiculo?: string } | null
  conductores?: { nombre: string; apellido: string; telefono?: string } | null
  rutas?: { nombre?: string; origen?: string; destino?: string; distanciaKm?: number } | null
}

interface ViajeCardProps {
  viaje: ViajeDatos
  vehiculo?: { placa: string; marca: string; tipoVehiculo?: string } | null
  conductor?: { nombre: string; apellido: string; telefono?: string } | null
  ruta?: { nombre?: string; origen?: string; destino?: string; distanciaKm?: number } | null
  onRefresh?: () => void
}

// Mapeo de estados a colores y textos
const ESTADO_CONFIG = {
  pendiente: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    label: "Pendiente"
  },
  en_progreso: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    label: "En Progreso"
  },
  completado: {
    color: "bg-green-100 text-green-800 border-green-300",
    label: "Completado"
  },
  cancelado: {
    color: "bg-red-100 text-red-800 border-red-300",
    label: "Cancelado"
  }
}

export function ViajeCard({ viaje, vehiculo, conductor, ruta, onRefresh }: ViajeCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Validar que tenemos datos
  if (!viaje) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center text-red-600">
          <p>Error: Datos de viaje no disponibles</p>
        </CardContent>
      </Card>
    )
  }

  const estado = viaje.estado || "pendiente"
  const estadoConfig = ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG] || ESTADO_CONFIG.pendiente

  // Función para formatear fecha
  const formatearFecha = (fecha: any) => {
    if (!fecha) return "No especificada"
    try {
      return format(new Date(fecha), "dd MMM yyyy, HH:mm", { locale: es })
    } catch {
      return "Fecha inválida"
    }
  }

  // Función para descargar PDF
  const handleDescargarPDF = async () => {
    if (!viaje.id) {
      toast.error("No se puede generar PDF: ID de viaje no disponible")
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch("/api/generar-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viajeId: viaje.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al generar PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Hoja-Ruta-${viaje.numeroViaje || viaje.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("PDF descargado exitosamente")
    } catch (error) {
      console.error("Error descargando PDF:", error)
      toast.error(error instanceof Error ? error.message : "Error al descargar PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-forest-green-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-forest-green-900">
              Viaje #{viaje.numeroViaje || "S/N"}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Package className="h-3 w-3" />
              {viaje.producto || "Producto no especificado"}
            </p>
          </div>
          <Badge 
            variant="default" 
            className={`${estadoConfig.color} border font-medium`}
          >
            {estadoConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        {/* Ruta */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700">Origen</p>
              <p className="text-gray-600 truncate">
                {ruta?.origen || viaje.lugarCarga || "No especificado"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Navigation className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700">Destino</p>
              <p className="text-gray-600 truncate">
                {ruta?.destino || viaje.lugarDescarga || "No especificado"}
              </p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="border-t pt-3 space-y-2">
          {vehiculo && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4 text-vibrant-orange-500" />
              <span className="font-medium">{vehiculo.placa}</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs">{vehiculo.marca || "N/A"}</span>
            </div>
          )}

          {conductor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 text-vibrant-orange-500" />
              <span className="truncate">
                {conductor.nombre} {conductor.apellido}
              </span>
            </div>
          )}

          {viaje.fechaInicio && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-vibrant-orange-500" />
              <span className="text-xs">{formatearFecha(viaje.fechaInicio)}</span>
            </div>
          )}
        </div>

        {/* Cantidad y distancia */}
        {(viaje.cantidad || ruta?.distanciaKm) && (
          <div className="flex items-center gap-4 text-xs bg-gray-50 p-2 rounded-md">
            {viaje.cantidad && (
              <div>
                <span className="font-medium text-gray-700">Cantidad: </span>
                <span className="text-gray-600">
                  {viaje.cantidad} {viaje.unidad || ""}
                </span>
              </div>
            )}
            {ruta?.distanciaKm && (
              <div>
                <span className="font-medium text-gray-700">Distancia: </span>
                <span className="text-gray-600">{ruta.distanciaKm} km</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleDescargarPDF}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              PDF
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}