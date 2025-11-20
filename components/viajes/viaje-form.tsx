"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { CreateViajeInput } from "@/types/viaje"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useConductores } from "@/hooks/use-conductores"
import { useRutas } from "@/hooks/use-rutas"
import { Select } from "@/components/ui/select"

interface ViajeFormProps {
  onSubmit: (data: CreateViajeInput) => Promise<void>
  isLoading?: boolean
}

export function ViajeForm({ onSubmit, isLoading }: ViajeFormProps) {
  const [formData, setFormData] = useState<CreateViajeInput>({
    vehiculoId: "",
    conductorId: "",
    rutaId: "",
    numeroViaje: `VJ-${Date.now()}`,
    numeroFactura: "",
    producto: "",
    cantidad: 0,
    lugarCarga: "", 
    lugarDescarga: "", 
    fechaInicio: new Date(),
    horaInicio: "",
    fechaEstimadaLlegada: undefined,
    observaciones: "",
  })

  const { vehiculos } = useVehiculos()
  const { conductores } = useConductores()
  const { rutas } = useRutas()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? Number.parseFloat(value) : value,
    }))
  }

  
  const rutaSeleccionada = rutas?.find((r: any) => r.id === formData.rutaId)

  useEffect(() => {
    if (rutaSeleccionada) {
      setFormData(prev => ({
        ...prev,
        lugarCarga: rutaSeleccionada.origen,
        lugarDescarga: rutaSeleccionada.destino
      }))
    }
  }, [rutaSeleccionada])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar que tenemos los campos requeridos
    if (!formData.lugarCarga || !formData.lugarDescarga) {
      alert("Por favor selecciona una ruta para completar los lugares de carga y descarga")
      return
    }

    await onSubmit(formData)
    setFormData({
      vehiculoId: "",
      conductorId: "",
      rutaId: "",
      numeroViaje: `VJ-${Date.now()}`,
      numeroFactura: "",
      producto: "",
      cantidad: 0,
      lugarCarga: "",
      lugarDescarga: "",
       unidad: "litros",
      fechaInicio: new Date(),
      horaInicio: "",
      fechaEstimadaLlegada: undefined,
      observaciones: "",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sección 1: Información Básica */}
      <motion.div variants={itemVariants} className="space-y-4 p-4 bg-forest-green-50 rounded-lg">
        <h3 className="font-semibold text-forest-green-900">Información Básica</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numeroViaje">Número de Viaje</Label>
            <Input
              id="numeroViaje"
              name="numeroViaje"
              value={formData.numeroViaje}
              onChange={handleChange}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroFactura">Número de Factura</Label>
            <Input
              id="numeroFactura"
              name="numeroFactura"
              placeholder="Opcional"
              value={formData.numeroFactura || ""}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="producto">Producto</Label>
            <Input
              id="producto"
              name="producto"
              placeholder="Ej: Gasolina, Diésel"
              value={formData.producto}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad (Litros)</Label>
            <Input
              id="cantidad"
              name="cantidad"
              type="number"
              placeholder="0"
              value={formData.cantidad}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Sección 2: Vehículo y Conductor */}
      <motion.div variants={itemVariants} className="space-y-4 p-4 bg-vibrant-orange-50 rounded-lg">
        <h3 className="font-semibold text-forest-green-900">Vehículo y Conductor</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehiculoId">Vehículo</Label>
            <Select
              id="vehiculoId"
              name="vehiculoId"
              value={formData.vehiculoId}
              onChange={handleChange}
              className="bg-white"
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos?.map((v: any, index: number) => (
                <option key={v.id || `vehiculo-${index}`} value={v.id || ""}>
                  {v.placa} - {v.marca}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conductorId">Conductor</Label>
            <Select
              id="conductorId"
              name="conductorId"
              value={formData.conductorId}
              onChange={handleChange}
              className="bg-white"
            >
              <option value="">Selecciona un conductor</option>
              {conductores?.map((c: any, index: number) => (
                <option key={c.id || `conductor-${index}`} value={c.id || ""}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Sección 3: Selección de Ruta */}
      <motion.div variants={itemVariants} className="space-y-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-forest-green-900">Ruta de Transporte</h3>

        <div className="space-y-2">
          <Label htmlFor="rutaId">Selecciona una Ruta</Label>
          <Select
            id="rutaId"
            name="rutaId"
            value={formData.rutaId}
            onChange={handleChange}
            className="bg-white"
          >
            <option value="">Selecciona una ruta</option>
            {rutas?.map((r: any, index: number) => (
              <option key={r.id || `ruta-${index}`} value={r.id || ""}>
                {r.nombre} ({r.origen} → {r.destino})
              </option>
            ))}
          </Select>
        </div>

        {rutaSeleccionada && (
          <Card className="p-4 bg-white border-vibrant-orange-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Origen:</span>
                <span className="text-right">{rutaSeleccionada.origen}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Destino:</span>
                <span className="text-right">{rutaSeleccionada.destino}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Distancia:</span>
                <span>{rutaSeleccionada.distanciaKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Duración Estimada:</span>
                <span>{rutaSeleccionada.duracionMinutos} minutos</span>
              </div>
            </div>
          </Card>
        )}

        {/* Campos ocultos que se envían al backend */}
        <input type="hidden" name="lugarCarga" value={formData.lugarCarga} />
        <input type="hidden" name="lugarDescarga" value={formData.lugarDescarga} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <Input
              id="fechaInicio"
              name="fechaInicio"
              type="datetime-local"
              value={formData.fechaInicio.toISOString().slice(0, 16)}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horaInicio">Hora de Inicio</Label>
            <Input
              id="horaInicio"
              name="horaInicio"
              type="time"
              value={formData.horaInicio || ""}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Sección 4: Observaciones */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          name="observaciones"
          placeholder="Notas adicionales del viaje"
          value={formData.observaciones || ""}
          onChange={handleChange}
          className="bg-white"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.rutaId}
          className="flex-1 bg-vibrant-orange-500 hover:bg-vibrant-orange-600"
        >
          {isLoading ? "Creando..." : "Crear Viaje"}
        </Button>
      </motion.div>
    </motion.form>
  )
}