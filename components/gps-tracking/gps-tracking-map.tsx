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
  const { vehiculos, isLoading, error } = useGpsTracking(3000) // Actualizar cada 3 segundos
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoTracking | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-16.5, -68.15]) // Bolivia centro
  const [mapZoom, setMapZoom] = useState(13)

  // DEBUG: Ver qué datos llegan del hook
  useEffect(() => {
    console.log("🔍 GpsTrackingMap - Estado:")
    console.log("📍 vehiculos:", vehiculos)
    console.log("🔄 isLoading:", isLoading)
    console.log("❌ error:", error)
    console.log("📊 Total vehículos:", vehiculos.length)
    
    if (vehiculos.length > 0) {
      console.log("🚗 Primer vehículo:", vehiculos[0])
    }
  }, [vehiculos, isLoading, error])

  const handleVehiculoSelect = (vehiculo: VehiculoTracking) => {
    setSelectedVehiculo(vehiculo)
    setMapCenter([vehiculo.posicion.latitud, vehiculo.posicion.longitud])
    setMapZoom(15)
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900">Error cargando datos GPS</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Panel de debug */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-bold text-sm mb-2">🚗 Debug GPS</h3>
        <div className="text-xs space-y-1">
          <p>Vehículos: <strong>{vehiculos.length}</strong></p>
          <p>Estado: <strong>{isLoading ? "Cargando..." : "Listo"}</strong></p>
          {vehiculos.length > 0 && (
            <div className="mt-2 p-2 bg-green-50 rounded">
              <p className="font-medium">{vehiculos[0].vehiculo.placa}</p>
              <p>📍 {vehiculos[0].posicion.latitud.toFixed(6)}, {vehiculos[0].posicion.longitud.toFixed(6)}</p>
              <p>⚡ {vehiculos[0].posicion.velocidad} km/h</p>
            </div>
          )}
        </div>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        className="h-full w-full" 
        zoomControl={true}
      >
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