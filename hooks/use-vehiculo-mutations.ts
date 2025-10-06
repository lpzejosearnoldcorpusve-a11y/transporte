"use client"

import { useState } from "react"
import type { Vehiculo, VehiculoFormData } from "@/types/vehiculo"

export function useVehiculoMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createVehiculo = async (data: VehiculoFormData | Vehiculo) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear vehículo")
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateVehiculo = async (id: string, data: VehiculoFormData | Vehiculo) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/vehiculos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar vehículo")
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteVehiculo = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/vehiculos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar vehículo")
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    loading,
    error,
  }
}
