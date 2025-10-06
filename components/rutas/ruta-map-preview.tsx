"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface RutaMapPreviewProps {
  origen: string
  destino: string
  origenLat?: number
  origenLng?: number
  destinoLat?: number
  destinoLng?: number
  distanciaKm?: number
  duracionMinutos?: number
}

export function RutaMapPreview({
  origen,
  destino,
  origenLat,
  origenLng,
  destinoLat,
  duracionMinutos,
  distanciaKm,
}: RutaMapPreviewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <Card className="p-4 bg-muted">
        <p className="text-sm text-muted-foreground">Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para ver el mapa</p>
      </Card>
    )
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&mode=driving`

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border shadow-sm">
        <iframe
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
      </div>

      {(distanciaKm || duracionMinutos) && (
        <div className="grid grid-cols-2 gap-4">
          {distanciaKm && (
            <Card className="p-4 bg-gradient-to-br from-forest-green-50 to-forest-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-forest-green-500 rounded-lg">
                  <Navigation className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distancia</p>
                  <p className="text-2xl font-bold text-forest-green-700">{distanciaKm} km</p>
                </div>
              </div>
            </Card>
          )}

          {duracionMinutos && (
            <Card className="p-4 bg-gradient-to-br from-vibrant-orange-50 to-vibrant-orange-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-vibrant-orange-500 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="text-2xl font-bold text-vibrant-orange-700">
                    {Math.floor(Number(duracionMinutos) / 60)}h {Number(duracionMinutos) % 60}m
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {origenLat && origenLng && destinoLat && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-forest-green-700">📍 Origen</p>
            <p className="text-muted-foreground">{origen}</p>
            <p className="text-xs text-muted-foreground">
              {origenLat.toFixed(6)}, {origenLng.toFixed(6)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-vibrant-orange-700">🎯 Destino</p>
            <p className="text-muted-foreground">{destino}</p>
            <p className="text-xs text-muted-foreground">
              {destinoLat.toFixed(6)}, {destinoLat.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
