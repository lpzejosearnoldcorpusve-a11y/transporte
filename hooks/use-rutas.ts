"use client"

import { useState, useEffect } from "react"
import type { Ruta } from "@/types/ruta"

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRutas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rutas")
      if (!response.ok) throw new Error("Error al cargar rutas")
      const data = await response.json()
      setRutas(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRutas()
  }, [])

  return { rutas, loading, error, refetch: fetchRutas }
}
