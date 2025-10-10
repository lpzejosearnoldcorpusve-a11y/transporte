"use client"

import { Truck, Wrench, XCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface VehiculoStatusIndicatorProps {
  estado: string | null
  size?: "icon" | "badge"
  className?: string
}

export function VehiculoStatusIndicator({ estado, size = "icon", className }: VehiculoStatusIndicatorProps) {
  const getEstadoConfig = (estado: string | null) => {
    switch (estado) {
      case "activo":
        return {
          icon: CheckCircle,
          label: "Activo",
          iconColor: "text-green-500",
          badgeColor: "bg-green-500 hover:bg-green-600",
        }
      case "mantenimiento":
        return {
          icon: Wrench,
          label: "Mantenimiento",
          iconColor: "text-vibrant-orange-500",
          badgeColor: "bg-vibrant-orange-500 hover:bg-vibrant-orange-600",
        }
      case "inactivo":
        return {
          icon: XCircle,
          label: "Inactivo",
          iconColor: "text-red-500",
          badgeColor: "bg-red-500 hover:bg-red-600",
        }
      default:
        return {
          icon: Truck,
          label: "Desconocido",
          iconColor: "text-gray-400",
          badgeColor: "bg-gray-400 hover:bg-gray-500",
        }
    }
  }

  const config = getEstadoConfig(estado)
  const Icon = config.icon

  if (size === "badge") {
    return <Badge className={cn(config.badgeColor, "text-white", className)}>{config.label}</Badge>
  }

  return <Icon className={cn("h-5 w-5", config.iconColor, className)} />
}
