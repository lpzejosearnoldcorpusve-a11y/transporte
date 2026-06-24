"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  ImageIcon,
  Eye,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useFacturas, useCreateFactura, useUpdateFactura } from "@/hooks/use-facturas"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import type { Factura } from "@/types/factura"

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIAS = [
  "Combustible",
  "Mantenimiento",
  "Reparación",
  "Peaje",
  "Hospedaje",
  "Comidas",
  "Otro",
] as const

const MONEDAS = ["BOB", "USD", "PEN"] as const

const ESTADO_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  procesada: "success",
  pendiente: "warning",
  error: "danger",
}

const ESTADO_ICON: Record<string, typeof CheckCircle2> = {
  procesada: CheckCircle2,
  pendiente: Clock,
  error: AlertTriangle,
}

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  categoria: string
  monto: string
  moneda: string
  fecha: string
  proveedor: string
  numeroFactura: string
  nit: string
  descripcion: string
  confianza: number
}

const emptyForm: FormState = {
  categoria: "Combustible",
  monto: "",
  moneda: "BOB",
  fecha: new Date().toISOString().split("T")[0],
  proveedor: "",
  numeroFactura: "",
  nit: "",
  descripcion: "",
  confianza: 0,
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function toDateInput(date: Date | string | undefined | null): string {
  if (!date) return new Date().toISOString().split("T")[0]
  return new Date(date).toISOString().split("T")[0]
}

function extractOcrFormData(ocrRaw: any): Partial<FormState> {
  if (!ocrRaw) return {}
  let ocr = ocrRaw
  if (typeof ocrRaw === "string") {
    try { ocr = JSON.parse(ocrRaw) } catch { return {} }
  }
  return {
    monto: ocr.total?.toString() ?? "",
    fecha: ocr.fecha_parsed ? toDateInput(ocr.fecha_parsed) : undefined,
    proveedor: ocr.proveedor_extraido ?? "",
    numeroFactura: ocr.numero_factura_extraido ?? "",
    nit: ocr.nit ?? "",
    confianza: typeof ocr.confianza === "number" ? ocr.confianza : 0,
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function FacturasGallery() {
  const { data: facturas, isLoading } = useFacturas()
  const createFactura = useCreateFactura()
  const updateFactura = useUpdateFactura()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewName, setPreviewName] = useState("")
  const [previewType, setPreviewType] = useState("")
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  // Cloudinary upload metadata
  const [uploadedUrl, setUploadedUrl] = useState("")
  const [uploadedPublicId, setUploadedPublicId] = useState("")

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const stats = {
    total: facturas?.length ?? 0,
    procesadas: facturas?.filter((f) => f.estado === "procesada").length ?? 0,
    pendientes: facturas?.filter((f) => f.estado === "pendiente").length ?? 0,
    errores: facturas?.filter((f) => f.estado === "error").length ?? 0,
  }

  // ─── Upload Flow ────────────────────────────────────────────────────────────

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Reset input so same file can be re-selected
      e.target.value = ""

      setIsUploading(true)
      setUploadProgress("Subiendo imagen...")

      try {
        // 1 — Upload to Cloudinary
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.error || "Error al subir la imagen")
        }

        const uploadData = await uploadRes.json()

        setUploadedUrl(uploadData.url)
        setUploadedPublicId(uploadData.public_id)
        setPreviewUrl(uploadData.url)
        setPreviewName(file.name)
        setPreviewType(file.type)

        // 2 — Run OCR
        setUploadProgress("Procesando con OCR...")

        let ocrData: Record<string, any> | null = null
        try {
          const ocrRes = await fetch("/api/ocr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: uploadData.url }),
          })

          if (ocrRes.ok) {
            ocrData = await ocrRes.json()
          }
        } catch {
          // OCR may fail — that's ok, user can fill in manually
          console.warn("OCR processing failed, continuing without extracted data")
        }

        // 3 — Open modal with pre-filled data
        setEditingFactura(null)
        const ocrFields = extractOcrFormData(ocrData?.data || ocrData)
        setForm({
          ...emptyForm,
          ...ocrFields,
        })
        setModalOpen(true)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Error al subir la imagen",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setUploadProgress("")
      }
    },
    [toast]
  )

  // ─── Open existing factura ─────────────────────────────────────────────────

  const openFactura = useCallback((factura: Factura) => {
    setEditingFactura(factura)
    setPreviewUrl(factura.archivoUrl)
    setPreviewName(factura.archivoNombre)
    setPreviewType(factura.archivoTipo)
    setUploadedUrl(factura.archivoUrl)
    setUploadedPublicId(factura.cloudinaryPublicId ?? "")

    const ocrFields = extractOcrFormData(factura.datosOcr)
    setForm({
      categoria: factura.categoria || "Combustible",
      monto: ocrFields.monto ?? factura.datosOcr?.total?.toString() ?? "",
      moneda: "BOB",
      fecha: toDateInput(factura.fechaFactura),
      proveedor: factura.proveedor ?? "",
      numeroFactura: factura.numeroFactura ?? "",
      nit: ocrFields.nit ?? "",
      descripcion: "",
      confianza: ocrFields.confianza ?? 0,
    })
    setModalOpen(true)
  }, [])

  // ─── Save ───────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    setIsSaving(true)

    try {
      const datosOcrToSave = {
        total: parseFloat(form.monto) || 0,
        nit: form.nit,
        proveedor_extraido: form.proveedor,
        numero_factura_extraido: form.numeroFactura,
        fecha_parsed: form.fecha,
        confianza: form.confianza
      }

      if (editingFactura) {
        // Update existing factura
        await updateFactura.mutateAsync({
          id: editingFactura.id,
          categoria: form.categoria,
          proveedor: form.proveedor || undefined,
          numeroFactura: form.numeroFactura || undefined,
          fechaFactura: form.fecha,
          datosOcr: datosOcrToSave,
        })
      } else {
        // 1 — Create gasto
        const gastoRes = await fetch("/api/gastos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipoGasto: form.categoria,
            monto: parseFloat(form.monto) || 0,
            moneda: form.moneda,
            descripcion: form.descripcion || null,
            fecha: form.fecha,
            referenciaFactura: form.numeroFactura || null,
            imagenComprobanteUrl: uploadedUrl,
          }),
        })

        if (!gastoRes.ok) {
          const err = await gastoRes.json()
          throw new Error(err.error || "Error al crear gasto")
        }

        const gasto = await gastoRes.json()

        // 2 — Create factura linked to gasto
        await createFactura.mutateAsync({
          numeroFactura: form.numeroFactura || undefined,
          fechaFactura: form.fecha,
          proveedor: form.proveedor || undefined,
          categoria: form.categoria,
          archivoUrl: uploadedUrl,
          archivoNombre: previewName,
          archivoTipo: previewType,
          estado: "procesada",
          gastoId: gasto.id,
          datosOcr: datosOcrToSave,
        })
      }

      // Refresh and close
      queryClient.invalidateQueries({ queryKey: ["facturas"] })
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      setModalOpen(false)

      toast({
        title: "Éxito",
        description: editingFactura
          ? "Factura actualizada exitosamente"
          : "Gasto y factura creados exitosamente",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al guardar",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [
    editingFactura,
    form,
    uploadedUrl,
    previewName,
    previewType,
    createFactura,
    updateFactura,
    queryClient,
    toast,
  ])

  // ─── Form Updater ──────────────────────────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-forest-green-900 tracking-tight">
            Facturas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Galería de comprobantes e invoices procesados con OCR
          </p>
        </div>
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 h-11 px-6 text-base rounded-lg font-medium"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Upload className="mr-2 h-5 w-5" />
          )}
          Subir Factura
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <Badge className="bg-forest-green-50 text-forest-green-800 border border-forest-green-200 px-3 py-1">
          <FileText className="mr-1.5 h-3.5 w-3.5" />
          Total: {stats.total}
        </Badge>
        <Badge variant="success" className="px-3 py-1">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Procesadas: {stats.procesadas}
        </Badge>
        <Badge variant="warning" className="px-3 py-1">
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          Pendientes: {stats.pendientes}
        </Badge>
        <Badge variant="danger" className="px-3 py-1">
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
          Con error: {stats.errores}
        </Badge>
      </div>

      {/* Upload overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/80 p-8 text-center backdrop-blur-sm"
          >
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
            <p className="mt-3 text-lg font-medium text-emerald-800">
              {uploadProgress || "Subiendo y procesando con OCR..."}
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Esto puede tomar unos segundos
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-forest-green-600" />
          <span className="ml-3 text-gray-500">Cargando facturas...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!facturas || facturas.length === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
        >
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            No hay facturas registradas
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Sube tu primera factura para comenzar a procesarla con OCR
          </p>
          <Button
            onClick={handleUploadClick}
            className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 h-11 px-6 text-base rounded-lg font-medium"
          >
            <Upload className="mr-2 h-5 w-5" />
            Subir Primera Factura
          </Button>
        </motion.div>
      )}

      {/* Gallery Grid */}
      {!isLoading && facturas && facturas.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {facturas.map((factura) => {
            const EstadoIcon = ESTADO_ICON[factura.estado] ?? Clock
            const estadoVariant = ESTADO_VARIANT[factura.estado] ?? "warning"
            const monto = factura.datosOcr?.total

            return (
              <motion.div key={factura.id} variants={itemVariants} layout>
                <Card
                  className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => openFactura(factura)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {factura.archivoTipo?.startsWith("application/pdf") ? (
                      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <FileText className="h-16 w-16 text-gray-400" />
                        <span className="mt-2 text-xs text-gray-500">PDF</span>
                      </div>
                    ) : (
                      <img
                        src={factura.archivoUrl}
                        alt={factura.archivoNombre}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                      <Eye className="h-8 w-8 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </div>

                    {/* Estado badge overlay */}
                    <div className="absolute right-2 top-2">
                      <Badge variant={estadoVariant} className="shadow-sm">
                        <EstadoIcon className="mr-1 h-3 w-3" />
                        {factura.estado}
                      </Badge>
                    </div>
                  </div>

                  {/* Info bar */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-forest-green-50 text-forest-green-700 text-xs">
                        {factura.categoria}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDate(factura.fechaFactura)}
                      </span>
                    </div>

                    {monto && (
                      <p className="text-lg font-bold text-forest-green-900">
                        {typeof monto === "number" ? monto.toFixed(2) : monto} BOB
                      </p>
                    )}

                    {factura.proveedor && (
                      <p className="text-xs text-gray-500 truncate">
                        {factura.proveedor}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* ─── Edit / Create Modal ─────────────────────────────────────────────── */}
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        className="max-w-4xl"
      >
        <DialogContent className="bg-white rounded-xl shadow-2xl p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between p-6 pb-0">
              <DialogTitle>
                {editingFactura ? "Editar Factura" : "Nueva Factura"}
              </DialogTitle>
              <DialogClose onClick={() => setModalOpen(false)} />
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left column — Image preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Vista previa
              </Label>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {previewType?.startsWith("application/pdf") ? (
                  <div className="flex h-96 flex-col items-center justify-center">
                    <FileText className="h-20 w-20 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {previewName}
                    </span>
                  </div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa de factura"
                    className="max-h-96 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-96 items-center justify-center">
                    <ImageIcon className="h-20 w-20 text-gray-300" />
                  </div>
                )}
              </div>
              {previewName && (
                <p className="text-xs text-gray-400 truncate">{previewName}</p>
              )}
            </div>

            {/* Right column — Form */}
            <div className="space-y-4">
              {/* Categoría */}
              <Select
                label="Categoría"
                value={form.categoria}
                onChange={(e) => updateField("categoria", e.target.value)}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>

              {/* Monto + Moneda */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.monto}
                    onChange={(e) => updateField("monto", e.target.value)}
                  />
                </div>
                <Select
                  label="Moneda"
                  value={form.moneda}
                  onChange={(e) => updateField("moneda", e.target.value)}
                >
                  {MONEDAS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => updateField("fecha", e.target.value)}
                />
              </div>

              {/* Proveedor */}
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input
                  id="proveedor"
                  placeholder="Nombre del proveedor"
                  value={form.proveedor}
                  onChange={(e) => updateField("proveedor", e.target.value)}
                />
              </div>

              {/* Nº Factura */}
              <div className="space-y-2">
                <Label htmlFor="nro-factura">Nº Factura</Label>
                <Input
                  id="nro-factura"
                  placeholder="Número de factura"
                  value={form.numeroFactura}
                  onChange={(e) => updateField("numeroFactura", e.target.value)}
                />
              </div>

              {/* NIT */}
              <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  placeholder="NIT del proveedor"
                  value={form.nit}
                  onChange={(e) => updateField("nit", e.target.value)}
                />
              </div>

              {/* Descripción */}
              <Textarea
                label="Descripción"
                placeholder="Descripción del gasto..."
                value={form.descripcion}
                onChange={(e) => updateField("descripcion", e.target.value)}
                rows={3}
              />

              {/* Confianza OCR */}
              {form.confianza > 0 && (
                <div className="space-y-2">
                  <Label>Confianza OCR</Label>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={form.confianza}
                      className="flex-1 h-3"
                    />
                    <span className="text-sm font-semibold text-forest-green-700 min-w-[3rem] text-right">
                      {Math.round(form.confianza)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-gray-100 px-6 py-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 h-11 px-6 text-base rounded-lg font-medium"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingFactura ? "Guardar Cambios" : "Guardar Gasto y Factura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
