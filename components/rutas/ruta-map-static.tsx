"use client"
import Image from "next/image"

interface RutaMapStaticProps {
  origenLat: number
  origenLng: number
  destinoLat: number
  destinoLng: number
  routeGeometry?: string // Agregado para dibujar la ruta real
  width?: number
  height?: number
}

export function RutaMapStatic({
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  routeGeometry,
  width = 300,
  height = 200,
}: RutaMapStaticProps) {
  // Calcular el centro y zoom apropiado
  const centerLat = (origenLat + destinoLat) / 2
  const centerLng = (origenLng + destinoLng) / 2

  const latDiff = Math.abs(origenLat - destinoLat)
  const lngDiff = Math.abs(origenLng - destinoLng)
  const maxDiff = Math.max(latDiff, lngDiff)
  const zoom = maxDiff > 5 ? 6 : maxDiff > 2 ? 7 : maxDiff > 1 ? 8 : 9

  let staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=${zoom}&size=${width}x${height}`

  // Agregar marcadores de origen y destino
  staticMapUrl += `&markers=${origenLat},${origenLng},lightblue1|${destinoLat},${destinoLng},red1`

  if (routeGeometry) {
    // Simplificar la geometría para la URL (tomar cada 5to punto para no exceder límites de URL)
    const coords = routeGeometry.split(";")
    const simplifiedCoords = coords.filter((_, index) => index % 5 === 0)
    const pathString = simplifiedCoords.join(",")
    staticMapUrl += `&path=${pathString}`
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm bg-muted">
      <Image
        src={staticMapUrl || "/placeholder.svg"}
        alt="Mapa de ruta"
        width={width}
        height={height}
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  )
}
