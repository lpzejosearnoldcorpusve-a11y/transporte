"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileImage, Calendar, DollarSign, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Mantenimiento, MantenimientoCompletarData } from "@/types/mantenimiento"
import { extractTextFromImage, parseMantenimientoText } from "@/lib/ocr-service"
import { FichaUploadZone } from "./ficha-upload-zone"
import { FichasGallery } from "./fichas-gallery"
import { OcrProcessor } from "./ocr-processor"
import { PartesCambiadasSection } from "./partes-cambiadas-section"

interface CompletarMantenimientoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mantenimiento: Mantenimiento | null
  onSubmit: (id: string, data: MantenimientoCompletarData) => Promise<void>
}

export function CompletarMantenimientoDialog({
  open,
  onOpenChange,
  mantenimiento,
  onSubmit,
}: CompletarMantenimientoDialogProps) {
  const [fichas, setFichas] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [processingOcr, setProcessingOcr] = useState(false)
  const [ocrCompleted, setOcrCompleted] = useState(false)
  const [ocrError, setOcrError] = useState(false)
  const [formData, setFormData] = useState({
    fechaFin: new Date().toISOString().split("T")[0],
    trabajosRealizados: "",
    partesInteriores: [] as string[],
    partesExteriores: [] as string[],
    costoTotal: "",
  })
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + fichas.length > 5) {
      alert("Máximo 5 fichas permitidas")
      return
    }

    setFichas([...fichas, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFicha = (index: number) => {
    setFichas(fichas.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const procesarOCR = async () => {
    if (fichas.length === 0) {
      alert("Debes subir al menos una ficha")
      return
    }

    setProcessingOcr(true)
    setOcrError(false)
    try {
      const textos = await Promise.all(previews.map((preview) => extractTextFromImage(preview)))
      const textoCompleto = textos.join("\n\n")
      const datosExtraidos = parseMantenimientoText(textoCompleto)

      setFormData({
        ...formData,
        trabajosRealizados: datosExtraidos.trabajos?.join("\n") || formData.trabajosRealizados,
        partesInteriores: datosExtraidos.partes?.interiores || formData.partesInteriores,
        partesExteriores: datosExtraidos.partes?.exteriores || formData.partesExteriores,
        costoTotal: datosExtraidos.costo?.toString() || formData.costoTotal,
      })

      setOcrCompleted(true)
    } catch (error) {
      console.error("Error al procesar OCR:", error)
      setOcrError(true)
    } finally {
      setProcessingOcr(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mantenimiento) return

    if (fichas.length === 0) {
      alert("Debes subir al menos una ficha de mantenimiento")
      return
    }

    if (!ocrCompleted) {
      alert("Debes procesar las fichas con OCR antes de completar")
      return
    }

    setLoading(true)
    try {
      const fichasUrls = previews

      await onSubmit(mantenimiento.id, {
        fechaFin: new Date(formData.fechaFin),
        trabajosRealizados: formData.trabajosRealizados,
        partesInteriores: formData.partesInteriores,
        partesExteriores: formData.partesExteriores,
        costoTotal: Number.parseFloat(formData.costoTotal) || undefined,
        fichasUrls,
      })

      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addParte = (tipo: "interiores" | "exteriores", parte: string) => {
    if (!parte.trim()) return

    if (tipo === "interiores") {
      setFormData({
        ...formData,
        partesInteriores: [...formData.partesInteriores, parte],
      })
    } else {
      setFormData({
        ...formData,
        partesExteriores: [...formData.partesExteriores, parte],
      })
    }
  }

  const removeParte = (tipo: "interiores" | "exteriores", index: number) => {
    if (tipo === "interiores") {
      setFormData({
        ...formData,
        partesInteriores: formData.partesInteriores.filter((_, i) => i !== index),
      })
    } else {
      setFormData({
        ...formData,
        partesExteriores: formData.partesExteriores.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Completar Mantenimiento</DialogTitle>
          <p className="text-base text-muted-foreground">
            Sube las fichas del taller y completa la información del mantenimiento
          </p>
        </DialogHeader>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
          {/* Subir fichas */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-lg font-semibold">
              <FileImage className="h-5 w-5" />
              Fichas de Mantenimiento (1-5 hojas)
            </Label>

            <FichaUploadZone fichasCount={fichas.length} onFileChange={handleFileChange} />

            <FichasGallery previews={previews} onRemoveFicha={removeFicha} />

            <OcrProcessor
              fichasCount={fichas.length}
              isProcessing={processingOcr}
              isCompleted={ocrCompleted}
              hasError={ocrError}
              onProcess={procesarOCR}
            />
          </div>

          <AnimatePresence>
            {ocrCompleted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Fecha de finalización */}
                <div className="space-y-2">
                  <Label htmlFor="fechaFin" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Finalización
                  </Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    required
                  />
                </div>

                {/* Trabajos realizados */}
                <div className="space-y-2">
                  <Label htmlFor="trabajosRealizados" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Trabajos Realizados
                  </Label>
                  <textarea
                    id="trabajosRealizados"
                    className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange-500"
                    value={formData.trabajosRealizados}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trabajosRealizados: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Partes cambiadas */}
                <PartesCambiadasSection
                  partesInteriores={formData.partesInteriores}
                  partesExteriores={formData.partesExteriores}
                  onAddParte={addParte}
                  onRemoveParte={removeParte}
                />

                {/* Costo total */}
                <div className="space-y-2">
                  <Label htmlFor="costoTotal" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Costo Total (PEN)
                  </Label>
                  <Input
                    id="costoTotal"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({ ...formData, costoTotal: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !ocrCompleted}
              className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600"
            >
              {loading ? "Completando..." : "Completar Mantenimiento"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
