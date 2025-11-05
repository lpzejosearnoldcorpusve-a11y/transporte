import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dispositivosGps, vehiculos } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST - Vincular dispositivo con vehículo usando IMEI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imei, vehiculoId, fechaInstalacion } = body;

    if (!imei || !vehiculoId) {
      return NextResponse.json(
        { error: "IMEI y vehiculoId son requeridos" },
        { status: 400 }
      );
    }

    // Buscar dispositivo por IMEI
    const dispositivo = await db.query.dispositivosGps.findFirst({
      where: eq(dispositivosGps.imei, imei),
    });

    if (!dispositivo) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 });
    }

    // Verificar que el vehículo exista
    const vehiculo = await db.query.vehiculos.findFirst({
      where: eq(vehiculos.id, vehiculoId),
    });

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    // Verificar que el dispositivo no esté ya vinculado
    if (dispositivo.vehiculoId) {
      return NextResponse.json(
        { error: "El dispositivo ya está vinculado a un vehículo" },
        { status: 400 }
      );
    }

    // Vincular dispositivo con vehículo
    const [dispositivoActualizado] = await db
      .update(dispositivosGps)
      .set({
        vehiculoId,
        fechaInstalacion: fechaInstalacion ? new Date(fechaInstalacion) : new Date(),
      })
      .where(eq(dispositivosGps.id, dispositivo.id))
      .returning();

    // Actualizar vehículo con el GPS
    await db
      .update(vehiculos)
      .set({
        gpsId: dispositivo.imei,
        gpsActivo: true,
      })
      .where(eq(vehiculos.id, vehiculoId));

    return NextResponse.json({
      success: true,
      dispositivo: dispositivoActualizado,
      message: "Dispositivo vinculado correctamente",
    });
  } catch (error) {
    console.error("[Vincular Dispositivo Error]", error);
    return NextResponse.json({ error: "Error al vincular dispositivo" }, { status: 500 });
  }
}
