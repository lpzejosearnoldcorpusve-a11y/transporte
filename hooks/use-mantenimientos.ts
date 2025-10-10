"use client"

import { useState, useEffect } from "react"
import type { Mantenimiento } from "@/types/mantenimiento"

export function useMantenimientos(vehiculoId?: string, estado?: string) {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMantenimientos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (vehiculoId) params.append("vehiculoId", vehiculoId)
      if (estado) params.append("estado", estado)

      const response = await fetch(`/api/mantenimientos?${params}`)
      if (!response.ok) throw new Error("Error al cargar mantenimientos")

      const data = await response.json()
      setMantenimientos(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMantenimientos()
  }, [vehiculoId, estado])

  return { mantenimientos, loading, error, refetch: fetchMantenimientos }
}
