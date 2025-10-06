"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface RutaMapStaticProps {
  origenLat: number
  origenLng: number
  destinoLat: number
  destinoLng: number
  width?: number
  height?: number
}

export function RutaMapStatic({
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  width = 600,
  height = 300,
}: RutaMapStaticProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <Card className="p-4 bg-muted flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Mapa no disponible</p>
      </Card>
    )
  }

  const markers = `markers=color:green|label:O|${origenLat},${origenLng}&markers=color:red|label:D|${destinoLat},${destinoLng}`
  const path = `path=color:0x0088ff|weight:3|${origenLat},${origenLng}|${destinoLat},${destinoLng}`
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?${markers}&${path}&size=${width}x${height}&key=${apiKey}`

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <Image
        src={staticMapUrl || "/placeholder.svg"}
        alt="Mapa de ruta"
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  )
}
