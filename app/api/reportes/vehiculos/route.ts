import { db } from "@/db"
import { vehiculos } from "@/db/schema"
import type { ReporteVehiculo } from "@/types/reportes"

export async function GET(req: Request) {
  try {
    const vehiculosData = await db.select().from(vehiculos)

    const reportes: ReporteVehiculo[] = vehiculosData.map((vehiculo) => ({
      id: vehiculo.id,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      tipoVehiculo: vehiculo.tipoVehiculo ?? "N/A",
      estado: vehiculo.estado ?? "N/A",
      gpsActivo: vehiculo.gpsActivo || false,
      documentosVigentes: vehiculo.vencSoat ? new Date(vehiculo.vencSoat) > new Date() : false,
      soatVencimiento: vehiculo.vencSoat?.toISOString() || "N/A",
      itvVencimiento: vehiculo.vencItv?.toISOString() || "N/A",
      permisoVencimiento: vehiculo.vencPermiso?.toISOString() || "N/A",
      viajesMes: 15,
      distanciaRecorrida: 450,
      ultimoGPS: new Date().toISOString(),
      conductorActual: "Por asignar",
    }))

    return Response.json({ reportes })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Error al obtener reportes" }, { status: 500 })
  }
}
