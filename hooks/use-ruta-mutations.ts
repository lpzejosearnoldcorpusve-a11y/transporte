"use client"

import { useState } from "react"
import type { RutaFormData } from "@/types/ruta"

export function useRutaMutations(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

  const createRuta = async (data: RutaFormData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/rutas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear ruta")
      }

      onSuccess?.()
      return await response.json()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateRuta = async (id: string, data: Partial<RutaFormData>) => {
    setLoading(true)
    try {
      const response = await fetch("/api/rutas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) throw new Error("Error al actualizar ruta")

      onSuccess?.()
      return await response.json()
    } finally {
      setLoading(false)
    }
  }

  const deleteRuta = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rutas?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Error al eliminar ruta")

      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  return { createRuta, updateRuta, deleteRuta, loading }
}
