"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface Vehiculo {
  id?: string
  placa: string
  marca: string
  anio: string | null
  tipoVehiculo: string | null
  capacidadLitros: string | null
  combustible: string | null
  chasis: string | null
  nroSoat: string | null
  vencSoat: Date | null
  nroItv: string | null
  vencItv: Date | null
  nroPermiso: string | null
  vencPermiso: Date | null
  gpsId: string | null
  gpsActivo: boolean | null
  estado: string | null
}

interface VehiculoFormProps {
  formData: Vehiculo
  setFormData: (data: Vehiculo) => void
}

export function VehiculoForm({ formData, setFormData }: VehiculoFormProps) {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Información básica */}
        <div className="space-y-2">
          <Label htmlFor="placa">
            Placa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="placa"
            value={formData.placa}
            onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
            placeholder="ABC-123"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca">
            Marca/Modelo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
            placeholder="Volvo FH16"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>
          <Input
            id="anio"
            type="number"
            value={formData.anio || ""}
            onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
            placeholder="2023"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoVehiculo">Tipo de Vehículo</Label>
          <Select
            value={formData.tipoVehiculo || "cisterna"}
            onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
          >
            <option value="cisterna">Cisterna</option>
            <option value="camion">Camión</option>
            <option value="trailer">Tráiler</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacidadLitros">Capacidad (Litros)</Label>
          <Input
            id="capacidadLitros"
            type="number"
            value={formData.capacidadLitros || ""}
            onChange={(e) => setFormData({ ...formData, capacidadLitros: e.target.value })}
            placeholder="10000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="combustible">Combustible</Label>
          <Select
            value={formData.combustible || "diésel"}
            onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
          >
            <option value="diésel">Diésel</option>
            <option value="gasolina">Gasolina</option>
            <option value="gnv">GNV</option>
          </Select>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="chasis">Número de Chasis</Label>
          <Input
            id="chasis"
            value={formData.chasis || ""}
            onChange={(e) => setFormData({ ...formData, chasis: e.target.value })}
            placeholder="1HGBH41JXMN109186"
          />
        </div>
      </div>

      {/* Documentación */}
      <div className="space-y-3 rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-forest-green-700">Documentación</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nroSoat">Nro. SOAT</Label>
            <Input
              id="nroSoat"
              value={formData.nroSoat || ""}
              onChange={(e) => setFormData({ ...formData, nroSoat: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vencSoat">Vencimiento SOAT</Label>
            <Input
              id="vencSoat"
              type="date"
              value={formatDateForInput(formData.vencSoat)}
              onChange={(e) =>
                setFormData({ ...formData, vencSoat: e.target.value ? new Date(e.target.value) : null })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nroItv">Nro. ITV</Label>
            <Input
              id="nroItv"
              value={formData.nroItv || ""}
              onChange={(e) => setFormData({ ...formData, nroItv: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vencItv">Vencimiento ITV</Label>
            <Input
              id="vencItv"
              type="date"
              value={formatDateForInput(formData.vencItv)}
              onChange={(e) =>
                setFormData({ ...formData, vencItv: e.target.value ? new Date(e.target.value) : null })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nroPermiso">Nro. Permiso</Label>
            <Input
              id="nroPermiso"
              value={formData.nroPermiso || ""}
              onChange={(e) => setFormData({ ...formData, nroPermiso: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vencPermiso">Vencimiento Permiso</Label>
            <Input
              id="vencPermiso"
              type="date"
              value={formatDateForInput(formData.vencPermiso)}
              onChange={(e) =>
                setFormData({ ...formData, vencPermiso: e.target.value ? new Date(e.target.value) : null })
              }
            />
          </div>
        </div>
      </div>

      {/* GPS */}
      <div className="space-y-3 rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-forest-green-700">GPS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gpsId">ID GPS</Label>
            <Input
              id="gpsId"
              value={formData.gpsId || ""}
              onChange={(e) => setFormData({ ...formData, gpsId: e.target.value })}
              placeholder="GPS-12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpsActivo">Estado GPS</Label>
            <Select
              value={formData.gpsActivo ? "true" : "false"}
              onChange={(e) => setFormData({ ...formData, gpsActivo: e.target.value === "true" })}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label htmlFor="estado">Estado del Vehículo</Label>
        <Select
          value={formData.estado || "activo"}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
        >
          <option value="activo">Activo</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="inactivo">Inactivo</option>
        </Select>
      </div>
    </div>
  )
}
