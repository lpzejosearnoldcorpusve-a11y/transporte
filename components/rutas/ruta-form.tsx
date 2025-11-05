"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import type { Ruta, RutaFormData } from "@/types/ruta"
import type { Vehiculo } from "@/types/vehiculo"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { RutaMapPreview } from "./ruta-map-preview"
import { LocationPickerDialog } from "./location-picker-dialog"
import { useToast } from "@/hooks/use-toast"

interface RutaFormProps {
  ruta?: Ruta
  onSubmit: (data: RutaFormData) => Promise<void>
  onCancel: () => void
}

export function RutaForm({ ruta, onSubmit, onCancel }: RutaFormProps) {
  const { toast } = useToast()
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(false)
  const [calculatingRoute, setCalculatingRoute] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showOrigenPicker, setShowOrigenPicker] = useState(false)
  const [showDestinoPicker, setShowDestinoPicker] = useState(false)
  const [routeData, setRouteData] = useState<{
    distanciaKm?: number
    duracionMinutos?: number
    origenLat?: number
    origenLng?: number
    destinoLat?: number
    destinoLng?: number
    geometry?: Array<[number, number]>
  }>({})

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
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar vehículos")
        return res.json()
      })
      .then(setVehiculos)
      .catch((error) => {
        console.error("Error fetching vehicles:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los vehículos",
          variant: "destructive",
        })
      })
  }, [toast])

  const handleCalculateRoute = async () => {
    if (!routeData.origenLat || !routeData.origenLng || !routeData.destinoLat || !routeData.destinoLng) {
      toast({
        title: "Selecciona ubicaciones",
        description: "Debes seleccionar origen y destino en el mapa",
        variant: "destructive",
      })
      return
    }

    setCalculatingRoute(true)
    try {
      const response = await fetch("/api/rutas/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origenLat: routeData.origenLat,
          origenLng: routeData.origenLng,
          destinoLat: routeData.destinoLat,
          destinoLng: routeData.destinoLng,
        }),
      })

      if (!response.ok) throw new Error("Error al calcular ruta")

      const data = await response.json()
      setRouteData((prev) => ({
        ...prev,
        distanciaKm: data.distanceKm,
        duracionMinutos: data.durationMinutes,
        geometry: data.geometry,
      }))
      setShowMap(true)

      toast({
        title: "Ruta calculada",
        description: `Distancia: ${data.distanceKm} km, Duración: ${Math.floor(data.durationMinutes / 60)}h ${data.durationMinutes % 60}m`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo calcular la ruta",
        variant: "destructive",
      })
    } finally {
      setCalculatingRoute(false)
    }
  }

  const handleOrigenSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, origen: location.address }))
    setRouteData((prev) => ({
      ...prev,
      origenLat: location.lat,
      origenLng: location.lng,
    }))
  }

  const handleDestinoSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, destino: location.address }))
    setRouteData((prev) => ({
      ...prev,
      destinoLat: location.lat,
      destinoLng: location.lng,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.nombre || !formData.origen || !formData.destino) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la ruta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Ruta *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Ruta Lima - Arequipa"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehiculo">Vehículo</Label>
          <Select
            id="vehiculo"
            value={formData.vehiculoId}
            onChange={(e) => setFormData(prev => ({ ...prev, vehiculoId: e.target.value }))}
          >
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.placa} - {vehiculo.marca}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
            <Label>Origen *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOrigenPicker(true)}
              className="w-full justify-start text-left font-normal overflow-hidden"
            >
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-forest-green-500" />
              <span className="truncate">{formData.origen || "Seleccionar en mapa"}</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Destino *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDestinoPicker(true)}
              className="w-full justify-start text-left font-normal overflow-hidden"
            >
              <Navigation className="mr-2 h-4 w-4 flex-shrink-0 text-vibrant-orange-500" />
              <span className="truncate">{formData.destino || "Seleccionar en mapa"}</span>
            </Button>
          </div>

        {(routeData.origenLat && routeData.destinoLat) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCalculateRoute}
            disabled={calculatingRoute}
            className="w-full bg-transparent"
          >
            {calculatingRoute ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculando ruta por carreteras...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Calcular y Visualizar Ruta
              </>
            )}
          </Button>
        )}

        {showMap && routeData.geometry && (
          <RutaMapPreview
            origen={formData.origen}
            destino={formData.destino}
            origenLat={routeData.origenLat}
            origenLng={routeData.origenLng}
            destinoLat={routeData.destinoLat}
            destinoLng={routeData.destinoLng}
            distanciaKm={routeData.distanciaKm}
            duracionMinutos={routeData.duracionMinutos}
            geometry={routeData.geometry}
          />
        )}

        <div className="space-y-2">
          <Label htmlFor="fechaSalida">Fecha y Hora de Salida</Label>
          <Input
            id="fechaSalida"
            type="datetime-local"
            value={formData.fechaSalida}
            onChange={(e) => setFormData(prev => ({ ...prev, fechaSalida: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Input
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
            placeholder="Notas adicionales"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600"
          >
            {loading ? "Guardando..." : ruta ? "Actualizar" : "Crear Ruta"}
          </Button>
        </div>
      </form>

      <LocationPickerDialog
        open={showOrigenPicker}
        onOpenChange={setShowOrigenPicker}
        title="Seleccionar Origen"
        onLocationSelect={handleOrigenSelect}
      />

      <LocationPickerDialog
        open={showDestinoPicker}
        onOpenChange={setShowDestinoPicker}
        title="Seleccionar Destino"
        onLocationSelect={handleDestinoSelect}
      />
    </>
  )
}