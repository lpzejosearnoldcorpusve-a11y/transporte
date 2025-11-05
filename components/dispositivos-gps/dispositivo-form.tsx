"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { DispositivoFormData } from "@/types/dispositivo-gps"

interface DispositivoFormProps {
  onSubmit: (data: DispositivoFormData) => Promise<void>
  onCancel: () => void
}

export function DispositivoForm({ onSubmit, onCancel }: DispositivoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DispositivoFormData>({
    imei: "",
    modelo: "",
    fabricante: "",
    numeroSerie: "",
    intervaloReporte: 30,
    alertaVelocidad: 100,
    alertaCombustible: 20,
    observaciones: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof DispositivoFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Información Básica */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">Información Básica</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="imei">
                IMEI <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imei"
                value={formData.imei}
                onChange={(e) => handleChange("imei", e.target.value)}
                placeholder="Ej: 123456789012345"
                required
                maxLength={15}
                pattern="[0-9]{15}"
                title="El IMEI debe tener 15 dígitos"
              />
              <p className="text-xs text-gray-500">15 dígitos numéricos únicos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleChange("modelo", e.target.value)}
                placeholder="Ej: GT06N"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => handleChange("fabricante", e.target.value)}
                placeholder="Ej: Concox"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de Serie</Label>
              <Input
                id="numeroSerie"
                value={formData.numeroSerie}
                onChange={(e) => handleChange("numeroSerie", e.target.value)}
                placeholder="Número de serie del dispositivo"
              />
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">Configuración</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="intervaloReporte">Intervalo de Reporte (seg)</Label>
              <Input
                id="intervaloReporte"
                type="number"
                value={formData.intervaloReporte}
                onChange={(e) => handleChange("intervaloReporte", Number.parseInt(e.target.value))}
                min={10}
                max={3600}
              />
              <p className="text-xs text-gray-500">Cada cuántos segundos reporta</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertaVelocidad">Alerta Velocidad (km/h)</Label>
              <Input
                id="alertaVelocidad"
                type="number"
                value={formData.alertaVelocidad}
                onChange={(e) => handleChange("alertaVelocidad", Number.parseInt(e.target.value))}
                min={0}
                max={200}
              />
              <p className="text-xs text-gray-500">Velocidad máxima permitida</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertaCombustible">Alerta Combustible (%)</Label>
              <Input
                id="alertaCombustible"
                type="number"
                value={formData.alertaCombustible}
                onChange={(e) => handleChange("alertaCombustible", Number.parseInt(e.target.value))}
                min={0}
                max={100}
              />
              <p className="text-xs text-gray-500">Nivel mínimo de combustible</p>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            placeholder="Notas adicionales sobre el dispositivo..."
            className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500"
          />
        </div>
      </motion.div>

      {/* Botones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end gap-3"
      >
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.imei}
          className="bg-forest-green-600 hover:bg-forest-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Registrar Dispositivo"
          )}
        </Button>
      </motion.div>
    </form>
  )
}
