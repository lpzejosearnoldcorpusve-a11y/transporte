"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Conductor, ConductorFormData } from "@/types/conductor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

interface ConductorFormProps {
  conductor?: Conductor | null
  onSubmit: (data: ConductorFormData) => void
  onCancel: () => void
  loading?: boolean
}

const CATEGORIAS_LICENCIA = ["A", "B", "C"]

export function ConductorForm({ conductor, onSubmit, onCancel, loading }: ConductorFormProps) {
  const [formData, setFormData] = useState<ConductorFormData>({
    nombre: "",
    apellido: "",
    ci: "",
    licencia: "",
    categoria: "",
    vencimientoLicencia: "",
    telefono: "",
    direccion: "",
  })

  useEffect(() => {
    if (conductor) {
      setFormData({
        nombre: conductor.nombre,
        apellido: conductor.apellido,
        ci: conductor.ci,
        licencia: conductor.licencia,
        categoria: conductor.categoria,
        vencimientoLicencia: conductor.vencimientoLicencia
          ? new Date(conductor.vencimientoLicencia).toISOString().split("T")[0]
          : "",
        telefono: conductor.telefono || "",
        direccion: conductor.direccion || "",
      })
    }
  }, [conductor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Manejar cambio del select
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, categoria: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ci">CI *</Label>
          <Input
            id="ci"
            value={formData.ci}
            onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licencia">Nro. Licencia *</Label>
          <Input
            id="licencia"
            value={formData.licencia}
            onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Select
            id="categoria"
            value={formData.categoria}
            onChange={handleCategoriaChange}
            label="Categoría de licencia"
          >
            <option value="">Seleccionar categoría</option>
            {CATEGORIAS_LICENCIA.map((cat) => (
              <option key={cat} value={cat}>
                Categoría {cat}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vencimientoLicencia">Vencimiento Licencia *</Label>
          <Input
            id="vencimientoLicencia"
            type="date"
            value={formData.vencimientoLicencia}
            onChange={(e) => setFormData({ ...formData, vencimientoLicencia: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : conductor ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}