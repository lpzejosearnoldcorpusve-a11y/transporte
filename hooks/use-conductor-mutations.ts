"use client"

import { useState } from "react"
import type { CreateConductorData, UpdateConductorData } from "@/types/conductor"

export function useConductorMutations() {
  const [loading, setLoading] = useState(false)

  const createConductor = async (data: CreateConductorData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear conductor")
      }

      return await response.json()
    } finally {
      setLoading(false)
    }
  }

  const updateConductor = async (id: string, data: UpdateConductorData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/conductores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar conductor")
      }

      return await response.json()
    } finally {
      setLoading(false)
    }
  }

  const deleteConductor = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/conductores?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar conductor")
      }

      return await response.json()
    } finally {
      setLoading(false)
    }
  }

  return { createConductor, updateConductor, deleteConductor, loading }
}
