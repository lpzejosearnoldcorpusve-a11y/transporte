"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateGasto, useUpdateGasto } from "@/hooks/use-gastos"
import type { Gasto, GastoFormData } from "@/types/gasto"

const gastoFormSchema = z.object({
  tipoGasto: z.string().min(1, "Tipo de gasto es requerido"),
  monto: z.coerce.number().positive("Monto debe ser positivo"),
  moneda: z.string().default("BOB"),
  descripcion: z.string().optional(),
  fecha: z.string().min(1, "Fecha es requerida"),
  referenciaFactura: z.string().optional(),
  imagenComprobanteUrl: z.string().optional(),
  viajeId: z.string().optional(),
})

type GastoFormValues = z.infer<typeof gastoFormSchema>

const TIPOS_GASTO = [
  "Combustible",
  "Peaje",
  "Mantenimiento",
  "Reparación",
  "Tolls",
  "Estacionamiento",
  "Comidas",
  "Hospedaje",
  "Otro",
]

const MONEDAS = ["BOB", "USD", "PEN"]

interface GastoFormProps {
  gasto?: Gasto
  viajeId?: string
  onSuccess?: () => void
}

export function GastoForm({ gasto, viajeId, onSuccess }: GastoFormProps) {
  const createGasto = useCreateGasto()
  const updateGasto = useUpdateGasto()

  const form = useForm<GastoFormValues>({
    resolver: zodResolver(gastoFormSchema),
    defaultValues: gasto
      ? {
          tipoGasto: gasto.tipoGasto,
          monto: typeof gasto.monto === "string" ? parseFloat(gasto.monto) : gasto.monto,
          moneda: gasto.moneda,
          descripcion: gasto.descripcion || "",
          fecha: gasto.fecha.toString().split("T")[0],
          referenciaFactura: gasto.referenciaFactura || "",
          imagenComprobanteUrl: gasto.imagenComprobanteUrl || "",
          viajeId: gasto.viajeId || "",
        }
      : {
          tipoGasto: "",
          monto: 0,
          moneda: "BOB",
          descripcion: "",
          fecha: new Date().toISOString().split("T")[0],
          referenciaFactura: "",
          imagenComprobanteUrl: "",
          viajeId: viajeId || "",
        },
  })

  async function onSubmit(values: GastoFormValues) {
    const data = {
      ...values,
      monto: values.monto,
    }

    try {
      if (gasto) {
        await updateGasto.mutateAsync({ ...data, id: gasto.id })
      } else {
        const nuevoGasto = await createGasto.mutateAsync(data as GastoFormData)
        
        // Crear factura vinculada si hay imagen
        if (values.imagenComprobanteUrl) {
          await fetch("/api/facturas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              numeroFactura: values.referenciaFactura || "S/N",
              fechaFactura: values.fecha,
              proveedor: values.descripcion?.split("Prov: ")[1] || "Gasto Automático",
              categoria: values.tipoGasto,
              archivoUrl: values.imagenComprobanteUrl,
              archivoNombre: "Comprobante_" + nuevoGasto.id,
              archivoTipo: "image/jpeg",
              gastoId: nuevoGasto.id,
              viajeId: values.viajeId || null,
            }),
          })
        }
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error guardando gasto/factura", error)
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipoGasto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Gasto</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecciona tipo de gasto</option>
                      {TIPOS_GASTO.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="moneda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {MONEDAS.map((moneda) => (
                        <option key={moneda} value={moneda}>
                          {moneda}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe el gasto..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="referenciaFactura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia Factura</FormLabel>
                  <FormControl>
                    <Input placeholder="Nº factura..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagenComprobanteUrl"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Comprobante (Imagen)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/jpeg, image/png, image/webp, image/gif, application/pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          const formData = new FormData()
                          formData.append("file", file)

                          try {
                            // 1. Subir a Cloudinary
                            const uploadRes = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            })
                            const uploadData = await uploadRes.json()
                            
                            if (uploadData.success) {
                              onChange(uploadData.url)
                              
                              // 2. Procesar con OCR (Python)
                              try {
                                const ocrRes = await fetch("/api/ocr", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ url: uploadData.url }),
                                })
                                const ocrResult = await ocrRes.json()
                                
                                if (ocrResult.success && ocrResult.data) {
                                  const { total, fecha_parsed, proveedor_extraido, numero_factura_extraido } = ocrResult.data
                                  
                                  if (total) form.setValue("monto", total)
                                  if (fecha_parsed) {
                                    // format YYYY-MM-DD
                                    form.setValue("fecha", fecha_parsed.split("T")[0])
                                  }
                                  if (numero_factura_extraido) {
                                    form.setValue("referenciaFactura", numero_factura_extraido)
                                  }
                                  if (proveedor_extraido) {
                                    const desc = form.getValues("descripcion")
                                    form.setValue("descripcion", desc ? `${desc} | Prov: ${proveedor_extraido}` : `Prov: ${proveedor_extraido}`)
                                  }
                                }
                              } catch (ocrError) {
                                console.error("Error al procesar OCR:", ocrError)
                                // No bloqueamos si falla el OCR
                              }
                            } else {
                              alert("Error al subir imagen: " + uploadData.error)
                            }
                          } catch (error) {
                            console.error("Upload error:", error)
                            alert("Error de red al subir la imagen.")
                          }
                        }}
                        {...fieldProps}
                      />
                      {value && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={value} alt="Comprobante" className="h-16 w-16 object-cover rounded" />
                          <span className="text-sm text-green-600">Comprobante listo. (OCR Procesado)</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createGasto.isPending || updateGasto.isPending}>
            {createGasto.isPending || updateGasto.isPending ? "Guardando..." : gasto ? "Actualizar Gasto" : "Crear Gasto"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
