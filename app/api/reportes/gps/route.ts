import { db } from "@/db"
import { gpsTracking, dispositivosGps, vehiculos } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { ReporteGPS } from "@/types/reportes"
import { PgColumn } from "drizzle-orm/pg-core"

export async function GET(req: Request) {
    try {
        const dispositivosData = await db.select().from(dispositivosGps)

        const reportes: ReporteGPS[] = await Promise.all(
            dispositivosData.map(async (dispositivo) => {
                const ultimaPosicion = await db.select().from(gpsTracking).orderBy(desc(gpsTracking.timestamp)).limit(1)

                const vehiculo = dispositivo.vehiculoId
                    ? await db.query.vehiculos.findFirst({
                            where: eq(vehiculos.id, dispositivo.vehiculoId),
                        })
                    : null

                return {
                    dispositivo_id: dispositivo.id,
                    imei: dispositivo.imei,
                    vehiculo_placa: vehiculo?.placa || "Sin vehículo",
                    ubicacionActual: {
                        latitud: Number(dispositivo.ultimaLatitud || 0),
                        longitud: Number(dispositivo.ultimaLongitud || 0),
                        timestamp: dispositivo.ultimaSenal?.toISOString() || new Date().toISOString(),
                    },
                    velocidadPromedio: 45,
                    velocidadMaxima: 80,
                    frenadas: 3,
                    tiempoEncendido: 4,
                    consumoEstimado: 25,
                    alertas: {
                        excesoVelocidad: false,
                        combustibleBajo: false,
                        gpsDesconectado: !dispositivo.conectado,
                        fueraDeRuta: false,
                    },
                }
            }),
        )

        return Response.json({ reportes })
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Error al obtener reportes" }, { status: 500 })
    }
}


