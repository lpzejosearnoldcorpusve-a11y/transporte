"use client"

import { useState, useEffect } from "react"
import type { Conductor } from "@/types/conductor"

export function useConductores() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConductores = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/conductores")
      if (!response.ok) throw new Error("Error al cargar conductores")
      const data = await response.json()
      setConductores(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConductores()
  }, [])

  return { conductores, loading, error, refetch: fetchConductores }
}
