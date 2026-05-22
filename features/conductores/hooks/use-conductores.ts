"use client"

import { useState, useEffect } from "react"
import { conductoresService } from "../lib/conductores-service"
import type { Conductor } from "@/types/conductor"

export function useConductores() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConductores = async () => {
    try {
      setLoading(true)
      const data = await conductoresService.fetchAll()
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
