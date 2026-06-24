"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import type { Gasto, CreateGastoData, UpdateGastoData } from "@/types/gasto"

export function useGastos() {
  const { toast } = useToast()

  return useQuery<Gasto[], Error>({
    queryKey: ["gastos"],
    queryFn: async () => {
      const response = await fetch("/api/gastos")
      if (!response.ok) throw new Error("Error al obtener gastos")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 5000, // Hace "polling" silencioso cada 5 segundos para mantener actualizado como un websocket
  })
}

export function useCreateGasto() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateGastoData) => {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear gasto")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Éxito",
        description: "Gasto creado exitosamente",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useUpdateGasto() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateGastoData & { id: string }) => {
      const response = await fetch("/api/gastos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar gasto")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Éxito",
        description: "Gasto actualizado exitosamente",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDeleteGasto() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gastos?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar gasto")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Éxito",
        description: "Gasto eliminado exitosamente",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
