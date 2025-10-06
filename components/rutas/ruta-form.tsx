"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Ruta, RutaFormData } from "@/types/ruta"
import type { Vehiculo } from "@/types/vehiculo"

interface RutaFormProps {
  ruta?: Ruta
  onSubmit: (data: RutaFormData) => Promise<void>
  onCancel: () => void
}

export function RutaForm({ ruta, onSubmit, onCancel }: RutaFormProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RutaFormData>({
    nombre: ruta?.nombre || "",
    vehiculoId: ruta?.vehiculoId || "",
    origen: ruta?.origen || "",
    destino: ruta?.destino || "",
    fechaSalida: ruta?.fechaSalida ? new Date(ruta.fechaSalida).toISOString().slice(0, 16) : "",
    observaciones: ruta?.observaciones || "",
  })

  useEffect(() => {
    fetch("/api/vehiculos")
      .then((res) => res.json())
      .then(setVehiculos)
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Ruta *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Ej: Ruta Lima - Arequipa"
          required
        />
      </div>

      {/* Vehículo (select nativo) */}
      <div className="space-y-2">
        <Label htmlFor="vehiculo">Vehículo</Label>
        <select
          id="vehiculo"
          value={formData.vehiculoId}
          onChange={(e) => setFormData({ ...formData, vehiculoId: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Seleccionar vehículo</option>
          {vehiculos.map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.placa} - {vehiculo.marca}
            </option>
          ))}
        </select>
      </div>

      {/* Origen y Destino */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origen">Origen *</Label>
          <Input
            id="origen"
            value={formData.origen}
            onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
            placeholder="Dirección de origen"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destino">Destino *</Label>
          <Input
            id="destino"
            value={formData.destino}
            onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
            placeholder="Dirección de destino"
            required
          />
        </div>
      </div>

      {/* Fecha */}
      <div className="space-y-2">
        <Label htmlFor="fechaSalida">Fecha y Hora de Salida</Label>
        <Input
          id="fechaSalida"
          type="datetime-local"
          value={formData.fechaSalida}
          onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
        />
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Input
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          placeholder="Notas adicionales"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600">
          {loading ? "Guardando..." : ruta ? "Actualizar" : "Crear Ruta"}
        </Button>
      </div>
    </form>
  )
}
