"use client"

import { useToast } from "@/hooks/use-toast"
import type { CreateViajeInput, UpdateViajeInput } from "@/types/viaje"
import { useCallback } from "react"

export function useViajeMutations(onSuccess?: () => void) {
  const { toast } = useToast()

  const crearViaje = useCallback(
    async (data: CreateViajeInput) => {
      try {
        const response = await fetch("/api/viajes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error("Error creating viaje")

        toast({
          title: "Éxito",
          description: "Viaje creado correctamente",
        })

        onSuccess?.()
        return await response.json()
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al crear el viaje",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast, onSuccess],
  )

  const actualizarViaje = useCallback(
    async (id: string, data: UpdateViajeInput) => {
      try {
        const response = await fetch("/api/viajes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        })

        if (!response.ok) throw new Error("Error updating viaje")

        toast({
          title: "Éxito",
          description: "Viaje actualizado correctamente",
        })

        onSuccess?.()
        return await response.json()
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al actualizar el viaje",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast, onSuccess],
  )

  const eliminarViaje = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/viajes?id=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Error deleting viaje")

        toast({
          title: "Éxito",
          description: "Viaje eliminado correctamente",
        })

        onSuccess?.()
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar el viaje",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast, onSuccess],
  )

  const generarPDF = useCallback(
    async (viajeId: string) => {
      try {
        console.log("🔄 [Frontend] Iniciando generación de PDF para viaje:", viajeId)

        // Validación del ID
        if (!viajeId || viajeId.trim() === "") {
          throw new Error("ID de viaje no válido")
        }

        const trimmedViajeId = viajeId.trim()

        const response = await fetch("/api/viajes/generar-pdf", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            viajeId: trimmedViajeId 
          }),
        })

        console.log("📨 [Frontend] Respuesta del servidor:", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        })

        if (!response.ok) {
          let errorMessage = "Error generando PDF"
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.details || errorMessage
            console.error("❌ [Frontend] Error del servidor:", errorData)
          } catch (jsonError) {
            console.error("❌ [Frontend] Error parseando respuesta de error:", jsonError)
            errorMessage = `Error ${response.status}: ${response.statusText}`
          }
          throw new Error(errorMessage)
        }

        // Verificar que la respuesta sea un PDF
        const contentType = response.headers.get('content-type')
        console.log("📋 [Frontend] Content-Type:", contentType)

        if (!contentType?.includes('application/pdf')) {
          // Intentar leer la respuesta como texto para debug
          try {
            const textResponse = await response.text()
            console.error("❌ [Frontend] Respuesta no es PDF:", textResponse.substring(0, 200))
          } catch (textError) {
            console.error("❌ [Frontend] No se pudo leer respuesta como texto")
          }
          throw new Error("La respuesta del servidor no es un PDF válido")
        }

        const blob = await response.blob()
        console.log("📦 [Frontend] Blob recibido, tamaño:", blob.size, "bytes")
        
        if (blob.size === 0) {
          throw new Error("El PDF generado está vacío")
        }

        // Crear URL para el blob y descargar
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Hoja-Ruta-${trimmedViajeId}.pdf`
        document.body.appendChild(a)
        a.click()
        
        // Limpiar recursos
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }, 100)

        console.log("✅ [Frontend] PDF descargado exitosamente")

        toast({
          title: "Éxito",
          description: "PDF generado correctamente",
        })

      } catch (error) {
        console.error("💥 [Frontend] Error en generarPDF:", error)
        
        let errorMessage = "Error al generar el PDF"
        if (error instanceof Error) {
          errorMessage = error.message
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  return {
    crearViaje,
    actualizarViaje,
    eliminarViaje,
    generarPDF,
  }
}