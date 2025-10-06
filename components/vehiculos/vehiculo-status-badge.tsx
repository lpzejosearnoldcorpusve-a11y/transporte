"use client"

import { Badge } from "@/components/ui/badge"

interface VehiculoStatusBadgeProps {
  date: Date | null
  type?: "soat" | "itv" | "permiso"
}

export function VehiculoStatusBadge({ date, type = "soat" }: VehiculoStatusBadgeProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("es-ES")
  }

  const isExpiringSoon = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    const expDate = new Date(date)
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays >= 0
  }

  const isExpired = (date: Date | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  if (isExpired(date)) {
    return (
      <Badge variant="danger" className="text-xs">
        Vencido
      </Badge>
    )
  }

  if (isExpiringSoon(date)) {
    return (
      <Badge variant="warning" className="text-xs">
        Por vencer
      </Badge>
    )
  }

  return <span className="text-xs text-gray-600">{formatDate(date)}</span>
}
