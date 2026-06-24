"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import type { Factura, CreateFacturaData, UpdateFacturaData } from "@/types/factura"

export function useFacturas() {
  const { toast } = useToast()

  return useQuery<Factura[], Error>({
    queryKey: ["facturas"],
    queryFn: async () => {
      const response = await fetch("/api/facturas")
      if (!response.ok) throw new Error("Error al obtener facturas")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 5000, // Hace "polling" silencioso cada 5 segundos
  })
}

export function useCreateFactura() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFacturaData) => {
      const response = await fetch("/api/facturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear factura")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] })
      toast({
        title: "Éxito",
        description: "Factura creada exitosamente",
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

export function useUpdateFactura() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateFacturaData & { id: string }) => {
      const response = await fetch("/api/facturas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar factura")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] })
      toast({
        title: "Éxito",
        description: "Factura actualizada exitosamente",
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

export function useDeleteFactura() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/facturas?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar factura")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] })
      toast({
        title: "Éxito",
        description: "Factura eliminada exitosamente",
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
