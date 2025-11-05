"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { VehicleMarker } from "./vehicle-marker"
import { TrackingPanel } from "./tracking-panel"
import { useGpsTracking } from "@/hooks/use-gps-tracking"
import type { VehiculoTracking } from "@/types/gps-tracking"
import "leaflet/dist/leaflet.css"

// Componente para actualizar el centro del mapa
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

export function GpsTrackingMap() {
  const { vehiculos, isLoading } = useGpsTracking(3000) // Actualizar cada 3 segundos
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoTracking | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-16.5, -68.15]) // Bolivia centro
  const [mapZoom, setMapZoom] = useState(13)

  const handleVehiculoSelect = (vehiculo: VehiculoTracking) => {
    setSelectedVehiculo(vehiculo)
    setMapCenter([vehiculo.posicion.latitud, vehiculo.posicion.longitud])
    setMapZoom(15)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full" zoomControl={true}>
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehiculos.map((vehiculo) => (
          <VehicleMarker
            key={vehiculo.vehiculo.id}
            vehiculo={vehiculo}
            isSelected={selectedVehiculo?.vehiculo.id === vehiculo.vehiculo.id}
            onClick={() => handleVehiculoSelect(vehiculo)}
          />
        ))}
      </MapContainer>

      <TrackingPanel
        vehiculos={vehiculos}
        selectedVehiculo={selectedVehiculo}
        onVehiculoSelect={handleVehiculoSelect}
        isLoading={isLoading}
      />
    </div>
  )
}
