"use client"

import { useToast } from "@/hooks/use-toast"

export function useDocumentoConductorMutations() {
  const { toast } = useToast()

  const uploadDocumento = async (formData: FormData) => {
    try {
      const response = await fetch("/api/documentos-conductor", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al subir documento")
      }

      const data = await response.json()

      toast({
        title: "Documento subido",
        description: "El documento se ha subido correctamente",
      })

      return data
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo subir el documento",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateDocumento = async (id: string, data: Partial<any>) => {
    try {
      // Preparar los datos asegurando que las fechas estén en formato correcto
      const preparedData: any = { id }

      // Copiar todos los campos excepto las fechas y campos protegidos
      Object.keys(data).forEach((key) => {
        if (key !== 'fechaEmision' && 
            key !== 'fechaVencimiento' && 
            key !== 'creadoEn' && 
            key !== 'actualizadoEn' &&
            key !== 'urlArchivo' &&
            key !== 'nombreArchivo' &&
            key !== 'id') {
          preparedData[key] = data[key]
        }
      })

      // Manejar fechas específicamente
      if ('fechaEmision' in data) {
        if (data.fechaEmision === null || data.fechaEmision === undefined || data.fechaEmision === '') {
          preparedData.fechaEmision = null
        } else if (data.fechaEmision instanceof Date) {
          preparedData.fechaEmision = data.fechaEmision.toISOString()
        } else {
          // Ya es string, asegurar formato ISO
          preparedData.fechaEmision = new Date(data.fechaEmision).toISOString()
        }
      }

      if ('fechaVencimiento' in data) {
        if (data.fechaVencimiento === null || data.fechaVencimiento === undefined || data.fechaVencimiento === '') {
          preparedData.fechaVencimiento = null
        } else if (data.fechaVencimiento instanceof Date) {
          preparedData.fechaVencimiento = data.fechaVencimiento.toISOString()
        } else {
          // Ya es string, asegurar formato ISO
          preparedData.fechaVencimiento = new Date(data.fechaVencimiento).toISOString()
        }
      }

      console.log('Enviando datos al servidor:', preparedData)

      const response = await fetch("/api/documentos-conductor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error(errorData.details || errorData.error || "Error al actualizar documento")
      }

      const result = await response.json()

      toast({
        title: "Documento actualizado",
        description: "El documento se ha actualizado correctamente",
      })

      return result
    } catch (error) {
      console.error("Error en updateDocumento:", error)
      console.error("Datos que se intentaron enviar:", data)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el documento",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteDocumento = async (id: string) => {
    try {
      const response = await fetch(`/api/documentos-conductor?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar documento")
      }

      toast({
        title: "Documento eliminado",
        description: "El documento se ha eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el documento",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    uploadDocumento,
    updateDocumento,
    deleteDocumento,
  }
}