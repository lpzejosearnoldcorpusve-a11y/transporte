"use client"

import { Marker, Popup } from "react-leaflet"
import { DivIcon } from "leaflet"
import type { VehiculoTracking } from "@/types/gps-tracking"
import { Truck } from "lucide-react"
import { renderToString } from "react-dom/server"

interface VehicleMarkerProps {
  vehiculo: VehiculoTracking
  isSelected: boolean
  onClick: () => void
}

export function VehicleMarker({ vehiculo, isSelected, onClick }: VehicleMarkerProps) {
  const { posicion, vehiculo: vehiculoInfo } = vehiculo

  // Crear icono personalizado con el componente Truck
  const createCustomIcon = () => {
    const iconHtml = renderToString(
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-vibrant-orange-500 bg-vibrant-orange-500" : "border-forest-green-600 bg-forest-green-600"
        } shadow-lg transition-all`}
      >
        <Truck className="h-5 w-5 text-white" />
      </div>,
    )

    return new DivIcon({
      html: iconHtml,
      className: "custom-vehicle-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }

  return (
    <Marker
      position={[posicion.latitud, posicion.longitud]}
      icon={createCustomIcon()}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="space-y-2">
          <h3 className="font-bold text-forest-green-900">{vehiculoInfo.placa}</h3>
          <p className="text-sm text-gray-600">{vehiculoInfo.marca}</p>
          <div className="space-y-1 text-xs">
            <p>Velocidad: {posicion.velocidad?.toFixed(1) || "0"} km/h</p>
            <p>Altitud: {posicion.altitud?.toFixed(0) || "N/A"} m</p>
            <p>Satélites: {posicion.satelites || "N/A"}</p>
            <p className="text-gray-500">{new Date(posicion.timestamp).toLocaleString("es-BO")}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
