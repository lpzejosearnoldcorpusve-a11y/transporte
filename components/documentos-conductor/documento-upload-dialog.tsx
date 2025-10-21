"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select" // Tu Select personalizado
import { type TipoDocumento, TIPOS_DOCUMENTO_LABELS } from "@/types/documento-conductor"
import { Upload } from "lucide-react"

interface DocumentoUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conductorId: string
  onUpload: (formData: FormData) => Promise<void>
}

export function DocumentoUploadDialog({ open, onOpenChange, conductorId, onUpload }: DocumentoUploadDialogProps) {
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>("carnet_identidad")
  const [descripcion, setDescripcion] = useState("")
  const [fechaEmision, setFechaEmision] = useState("")
  const [fechaVencimiento, setFechaVencimiento] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!archivo) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("archivo", archivo)
      formData.append("conductorId", conductorId)
      formData.append("tipoDocumento", tipoDocumento)
      if (descripcion) formData.append("descripcion", descripcion)
      if (fechaEmision) formData.append("fechaEmision", fechaEmision)
      if (fechaVencimiento) formData.append("fechaVencimiento", fechaVencimiento)

      await onUpload(formData)

      // Reset form
      setTipoDocumento("carnet_identidad")
      setDescripcion("")
      setFechaEmision("")
      setFechaVencimiento("")
      setArchivo(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error uploading:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
            <Select
              id="tipoDocumento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
              required
            >
              {Object.entries(TIPOS_DOCUMENTO_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="archivo">Archivo *</Label>
            <Input
              id="archivo"
              type="file"
              accept="*/*"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Acepta cualquier tipo de archivo: imágenes, PDFs, documentos, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del documento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
              <Input
                id="fechaEmision"
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
              <Input
                id="fechaVencimiento"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!archivo || uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Subiendo..." : "Subir Documento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}