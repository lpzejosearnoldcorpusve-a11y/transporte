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
import { useCreateFactura, useUpdateFactura } from "@/hooks/use-facturas"
import type { Factura, FacturaFormData } from "@/types/factura"

const facturaFormSchema = z.object({
  numeroFactura: z.string().optional(),
  fechaFactura: z.string().min(1, "Fecha es requerida"),
  proveedor: z.string().optional(),
  categoria: z.string().min(1, "Categoría es requerida"),
  archivoUrl: z.string().min(1, "URL del archivo es requerida"),
  archivoNombre: z.string().min(1, "Nombre del archivo es requerido"),
  archivoTipo: z.string().min(1, "Tipo de archivo es requerido"),
  estado: z.string().default("pendiente"),
  conductorId: z.string().optional(),
  gastoId: z.string().optional(),
  vehiculoId: z.string().optional(),
  viajeId: z.string().optional(),
})

type FacturaFormValues = z.infer<typeof facturaFormSchema>

const CATEGORIAS = [
  "Combustible",
  "Mantenimiento",
  "Reparación",
  "Tolls",
  "Hospedaje",
  "Comidas",
  "Otro",
]

const ESTADOS = ["pendiente", "procesada", "error"]

interface FacturaFormProps {
  factura?: Factura
  onSuccess?: () => void
}

export function FacturaForm({ factura, onSuccess }: FacturaFormProps) {
  const createFactura = useCreateFactura()
  const updateFactura = useUpdateFactura()

  const form = useForm<FacturaFormValues>({
    resolver: zodResolver(facturaFormSchema),
    defaultValues: factura
      ? {
          numeroFactura: factura.numeroFactura || "",
          fechaFactura: factura.fechaFactura.toString().split("T")[0],
          proveedor: factura.proveedor || "",
          categoria: factura.categoria,
          archivoUrl: factura.archivoUrl,
          archivoNombre: factura.archivoNombre,
          archivoTipo: factura.archivoTipo,
          estado: factura.estado,
          conductorId: factura.conductorId || "",
          gastoId: factura.gastoId || "",
          vehiculoId: factura.vehiculoId || "",
          viajeId: factura.viajeId || "",
        }
      : {
          numeroFactura: "",
          fechaFactura: new Date().toISOString().split("T")[0],
          proveedor: "",
          categoria: "",
          archivoUrl: "",
          archivoNombre: "",
          archivoTipo: "",
          estado: "pendiente",
          conductorId: "",
          gastoId: "",
          vehiculoId: "",
          viajeId: "",
        },
  })

  async function onSubmit(values: FacturaFormValues) {
    if (factura) {
      await updateFactura.mutateAsync({ ...values, id: factura.id })
    } else {
      await createFactura.mutateAsync(values as FacturaFormData)
    }

    if (createFactura.isSuccess || updateFactura.isSuccess) {
      form.reset()
      onSuccess?.()
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numeroFactura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Factura</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: INV-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaFactura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Factura</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="proveedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecciona categoría</option>
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="archivoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Archivo</FormLabel>
                  <FormControl>
                    <Input placeholder="URL del archivo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="archivoNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Archivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del archivo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="archivoTipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Archivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: application/pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createFactura.isPending || updateFactura.isPending}>
            {createFactura.isPending || updateFactura.isPending ? "Guardando..." : factura ? "Actualizar Factura" : "Crear Factura"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
