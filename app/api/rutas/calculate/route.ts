import { NextResponse } from "next/server"
import { calculateRouteDistance } from "@/lib/google-maps"

export async function POST(request: Request) {
  try {
    const { origen, destino } = await request.json()

    if (!origen || !destino) {
      return NextResponse.json({ error: "Origen y destino son requeridos" }, { status: 400 })
    }

    const result = await calculateRouteDistance(origen, destino)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calculando ruta:", error)
    return NextResponse.json({ error: "Error al calcular la ruta" }, { status: 500 })
  }
}
