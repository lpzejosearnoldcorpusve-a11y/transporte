"use client"

import { useState } from "react"
import { conductoresService } from "../lib/conductores-service"
import type { CreateConductorData, UpdateConductorData } from "@/types/conductor"

export function useConductorMutations() {
  const [loading, setLoading] = useState(false)

  const createConductor = async (data: CreateConductorData) => {
    setLoading(true)
    try {
      return await conductoresService.create(data)
    } finally {
      setLoading(false)
    }
  }

  const updateConductor = async (id: string, data: UpdateConductorData) => {
    setLoading(true)
    try {
      return await conductoresService.update(id, data)
    } finally {
      setLoading(false)
    }
  }

  const deleteConductor = async (id: string) => {
    setLoading(true)
    try {
      return await conductoresService.delete(id)
    } finally {
      setLoading(false)
    }
  }

  return { createConductor, updateConductor, deleteConductor, loading }
}
