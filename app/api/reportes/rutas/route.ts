import { db } from "@/db"
import { rutas, vehiculos } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ReporteRuta } from "@/types/reportes"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado")

    let rutasData;
    if (estado) {
      rutasData = await db.select().from(rutas).where(eq(rutas.estado, estado));
    } else {
      rutasData = await db.select().from(rutas);
    }

    const reportes: ReporteRuta[] = await Promise.all(
      rutasData.map(async (ruta) => {
        const vehiculo = ruta.vehiculoId
          ? await db.query.vehiculos.findFirst({
              where: eq(vehiculos.id, ruta.vehiculoId),
            })
          : null

        return {
          id: ruta.id,
          nombre: ruta.nombre,
          origen: ruta.origen,
          destino: ruta.destino,
          estado: ruta.estado ?? "",
          distanciaKm: Number(ruta.distanciaKm || 0),
          duracionMinutos: Number(ruta.duracionMinutos || 0),
          fechaSalida: ruta.fechaSalida?.toISOString() || "",
          fechaLlegadaEstimada: ruta.fechaLlegadaEstimada?.toISOString() || "",
          vehiculoId: ruta.vehiculoId || "",
          vehiculoPlaca: vehiculo?.placa || "N/A",
          conductorId: "",
          conductorNombre: "Por asignar",
          tiempoRealMinutos:
            ruta.finReal && ruta.inicioReal
              ? Math.floor((ruta.finReal.getTime() - ruta.inicioReal.getTime()) / 60000)
              : undefined,
        }
      }),
    )

    return Response.json({ reportes })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Error al obtener reportes" }, { status: 500 })
  }
}
