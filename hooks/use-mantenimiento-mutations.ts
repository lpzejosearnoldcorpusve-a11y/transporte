"use client"

import { useState } from "react"
import type { MantenimientoFormData, MantenimientoCompletarData } from "@/types/mantenimiento"

export function useMantenimientoMutations() {
  const [loading, setLoading] = useState(false)

  const iniciarMantenimiento = async (data: MantenimientoFormData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/mantenimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al iniciar mantenimiento")

      return await response.json()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const completarMantenimiento = async (id: string, data: MantenimientoCompletarData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/mantenimientos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...data,
          estado: "completado",
        }),
      })

      if (!response.ok) throw new Error("Error al completar mantenimiento")

      return await response.json()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const eliminarMantenimiento = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/mantenimientos?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Error al eliminar mantenimiento")

      return await response.json()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    iniciarMantenimiento,
    completarMantenimiento,
    eliminarMantenimiento,
    loading,
  }
}
