"use client"

import { useToast } from "@/hooks/use-toast"
import type { DispositivoFormData, VincularVehiculoData } from "@/types/dispositivo-gps"

export function useDispositivoGpsMutations() {
  const { toast } = useToast()

  const crearDispositivo = async (data: DispositivoFormData) => {
    try {
      const response = await fetch("/api/dispositivos-gps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear dispositivo")
      }

      toast({
        title: "Dispositivo creado",
        description: "El dispositivo GPS ha sido registrado correctamente",
      })

      return await response.json()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear dispositivo",
        variant: "destructive",
      })
      throw error
    }
  }

  const actualizarDispositivo = async (id: string, data: Partial<DispositivoFormData>) => {
    try {
      const response = await fetch("/api/dispositivos-gps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar dispositivo")
      }

      toast({
        title: "Dispositivo actualizado",
        description: "Los cambios han sido guardados correctamente",
      })

      return await response.json()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar dispositivo",
        variant: "destructive",
      })
      throw error
    }
  }

  const eliminarDispositivo = async (id: string) => {
    try {
      const response = await fetch(`/api/dispositivos-gps?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar dispositivo")
      }

      toast({
        title: "Dispositivo eliminado",
        description: "El dispositivo ha sido eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar dispositivo",
        variant: "destructive",
      })
      throw error
    }
  }

  const vincularVehiculo = async (data: VincularVehiculoData) => {
    try {
      const response = await fetch("/api/dispositivos-gps/vincular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al vincular dispositivo")
      }

      toast({
        title: "Dispositivo vinculado",
        description: "El dispositivo ha sido vinculado al vehículo correctamente",
      })

      return await response.json()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al vincular dispositivo",
        variant: "destructive",
      })
      throw error
    }
  }

  const desvincularVehiculo = async (dispositivoId: string) => {
    try {
      const response = await fetch(`/api/dispositivos-gps/vincular?dispositivoId=${dispositivoId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al desvincular dispositivo")
      }

      toast({
        title: "Dispositivo desvinculado",
        description: "El dispositivo ha sido desvinculado del vehículo",
      })

      return await response.json()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al desvincular dispositivo",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    crearDispositivo,
    actualizarDispositivo,
    eliminarDispositivo,
    vincularVehiculo,
    desvincularVehiculo,
  }
}
