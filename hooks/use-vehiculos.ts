"use client"

import { useState, useEffect } from "react"
import type { Vehiculo } from "@/types/vehiculo"

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehiculos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/vehiculos")

      if (!response.ok) {
        throw new Error("Error al cargar vehículos")
      }

      const data = await response.json()
      setVehiculos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  return {
    vehiculos,
    loading,
    error,
    refetch: fetchVehiculos,
  }
}
