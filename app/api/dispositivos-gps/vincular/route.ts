import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dispositivosGps, vehiculos } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST - Vincular dispositivo con vehículo usando IMEI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imei, vehiculoId, fechaInstalacion } = body;

    console.log("📥 Datos recibidos:", { imei, vehiculoId, fechaInstalacion }); // DEBUG

    // Validación de campos requeridos
    if (!imei || !vehiculoId) {
      console.error("❌ Campos faltantes:", { imei: !!imei, vehiculoId: !!vehiculoId });
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
      console.error("❌ Dispositivo no encontrado con IMEI:", imei);
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 });
    }

    console.log("✅ Dispositivo encontrado:", dispositivo.id);

    // Verificar que el vehículo exista
    const vehiculo = await db.query.vehiculos.findFirst({
      where: eq(vehiculos.id, vehiculoId),
    });

    if (!vehiculo) {
      console.error("❌ Vehículo no encontrado con ID:", vehiculoId);
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    console.log("✅ Vehículo encontrado:", vehiculo.placa);

    // Verificar que el dispositivo no esté ya vinculado
    if (dispositivo.vehiculoId) {
      console.error("❌ Dispositivo ya vinculado a vehículo:", dispositivo.vehiculoId);
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
        actualizadoEn: new Date(),
      })
      .where(eq(dispositivosGps.id, dispositivo.id))
      .returning();

    console.log("✅ Dispositivo actualizado:", dispositivoActualizado.id);

    // CORRECCIÓN: Actualizar vehículo con el ID del dispositivo GPS
    await db
      .update(vehiculos)
      .set({
        gpsId: dispositivo.id,  // ← CORREGIDO: usar dispositivo.id en lugar de imei
        gpsActivo: true,
        actualizadoEn: new Date(),
      })
      .where(eq(vehiculos.id, vehiculoId));

    console.log("✅ Vehículo actualizado con GPS");

    return NextResponse.json({
      success: true,
      dispositivo: dispositivoActualizado,
      message: "Dispositivo vinculado correctamente",
    });
  } catch (error) {
    console.error("💥 [Vincular Dispositivo Error]", error);
    return NextResponse.json(
      { error: "Error interno al vincular dispositivo" },
      { status: 500 }
    );
  }
}