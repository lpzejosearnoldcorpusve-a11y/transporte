import { db } from "@/db"
import { conductores, documentosConductor, viajes } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ReporteConductor } from "@/types/reportes"
import { calcularDiasParaVencer } from "@/lib/reportes-utils"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const fechaInicio = searchParams.get("fechaInicio")
    const fechaFin = searchParams.get("fechaFin")

    const conductoresData = await db.select().from(conductores)

    const reportes: ReporteConductor[] = await Promise.all(
      conductoresData.map(async (conductor) => {
        const docs = await db
          .select()
          .from(documentosConductor)
          .where(eq(documentosConductor.conductorId, conductor.id))

        const viajesData = await db.select().from(viajes).where(eq(viajes.conductorId, conductor.id))

        const documentosCompletos = docs.length >= 4
        const diasParaVencer = calcularDiasParaVencer(conductor.vencimientoLicencia.toISOString())
        const licenciaVencida = diasParaVencer < 0
        const licenciaProxVencer = diasParaVencer >= 0 && diasParaVencer < 30

        return {
          id: conductor.id,
          nombre: conductor.nombre,
          apellido: conductor.apellido,
          ci: conductor.ci,
          licencia: conductor.licencia,
          categoria: conductor.categoria,
          vencimientoLicencia: conductor.vencimientoLicencia.toISOString(),
          telefono: conductor.telefono || "",
          direccion: conductor.direccion || "",
          documentosCompletos,
          licenciaVencida,
          licenciaProxVencer,
          diasParaVencer,
          viajesTotales: viajesData.length,
          horasTrabajadas: viajesData.length * 2, 
          rutaMasRecorrida: "Ruta Principal",
          ultimoViaje: viajesData[0]?.fechaInicio?.toISOString() || "N/A",
          estado: licenciaVencida ? "inactivo" : "activo",
        }
      }),
    )

    return Response.json({ reportes })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Error al obtener reportes" }, { status: 500 })
  }
}
