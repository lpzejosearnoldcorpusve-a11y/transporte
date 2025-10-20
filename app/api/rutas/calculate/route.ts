import { NextResponse } from "next/server"
import { calculateRouteDistance, calculateRouteFromCoordinates } from "@/lib/openstreetmap"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.origenLat && body.origenLng && body.destinoLat && body.destinoLng) {
      // Usar coordenadas directamente
      const result = await calculateRouteFromCoordinates(
        body.origenLat,
        body.origenLng,
        body.destinoLat,
        body.destinoLng,
      )
      return NextResponse.json(result)
    } else if (body.origen && body.destino) {
      // Geocodificar direcciones primero
      const result = await calculateRouteDistance(body.origen, body.destino)
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        {
          error:
            "Se requieren coordenadas (origenLat, origenLng, destinoLat, destinoLng) o direcciones (origen, destino)",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error calculando ruta:", error)
    return NextResponse.json({ error: "Error al calcular la ruta" }, { status: 500 })
  }
}
