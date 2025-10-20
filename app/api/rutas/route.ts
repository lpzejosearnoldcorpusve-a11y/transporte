// /app/api/rutas/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rutas, vehiculos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateRouteDistance } from "@/lib/openstreetmap";

// GET - Obtener todas las rutas
export async function GET() {
  try {
    const allRutas = await db
      .select({
        ruta: rutas,
        vehiculo: vehiculos,
      })
      .from(rutas)
      .leftJoin(vehiculos, eq(rutas.vehiculoId, vehiculos.id));

    // Formateo para una respuesta más limpia
    const formattedRutas = allRutas.map((item) => ({
      ...item.ruta,
      vehiculo: item.vehiculo,
    }));

    return NextResponse.json(formattedRutas);
  } catch (error) {
    console.error("Error obteniendo rutas:", error);
    return NextResponse.json({ error: "Error al obtener las rutas" }, { status: 500 });
  }
}

// POST - Crear nueva ruta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, vehiculoId, origen, destino, fechaSalida, observaciones } = body;

    if (!nombre || !origen || !destino) {
      return NextResponse.json({ error: "Nombre, origen y destino son requeridos" }, { status: 400 });
    }

    let distanceData;
    try {
      // Llamada a la API externa aislada para un mejor control de errores
      distanceData = await calculateRouteDistance(origen, destino);
    } catch (error) {
      console.error("Error con OpenStreetMap:", error);
      const errorMessage = error instanceof Error ? error.message : "No se pudo calcular la ruta.";
      return NextResponse.json({ error: `Error con OpenStreetMap: ${errorMessage}` }, { status: 400 });
    }

    // Calcular fecha de llegada estimada
    let fechaLlegadaEstimada: Date | null = null;
    if (fechaSalida && distanceData.durationMinutes) {
      const salida = new Date(fechaSalida);
      fechaLlegadaEstimada = new Date(salida.getTime() + distanceData.durationMinutes * 60000);
    }

    const [newRuta] = await db
      .insert(rutas)
      .values({
        nombre,
        vehiculoId: vehiculoId || null,
        origen,
        origenLat: distanceData.origenLat.toString(),
        origenLng: distanceData.origenLng.toString(),
        destino,
        destinoLat: distanceData.destinoLat.toString(),
        destinoLng: distanceData.destinoLng.toString(),
        distanciaKm: distanceData.distanceKm.toString(),
        duracionMinutos: distanceData.durationMinutes.toString(),
        fechaSalida: fechaSalida ? new Date(fechaSalida) : null,
        fechaLlegadaEstimada,
        observaciones: observaciones || null,
        estado: "planificada",
      })
      .returning()

    return NextResponse.json(newRuta, { status: 201 });
  } catch (error) {
    console.error("Error creando ruta:", error);
    return NextResponse.json({ error: "Error al crear la ruta" }, { status: 500 });
  }
}

// PUT - Actualizar ruta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de ruta es requerido" }, { status: 400 });
    }

    // Convertir fechas de string a Date si existen
    if (updateData.fechaSalida) {
      updateData.fechaSalida = new Date(updateData.fechaSalida);
    }
    if (updateData.fechaLlegadaEstimada) {
      updateData.fechaLlegadaEstimada = new Date(updateData.fechaLlegadaEstimada);
    }

    // Si se actualizan origen o destino, recalcular la distancia y duración
    if (updateData.origen || updateData.destino) {
      const [existingRuta] = await db.select().from(rutas).where(eq(rutas.id, id)).limit(1);

      if (!existingRuta) {
        return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 });
      }

      // Usa el nuevo dato o el existente si no se provee uno nuevo
      const origen = updateData.origen || existingRuta.origen;
      const destino = updateData.destino || existingRuta.destino;
      
      try {
        const distanceData = await calculateRouteDistance(origen, destino);

        // Actualiza todos los campos relacionados con la ruta
        updateData.origenLat = distanceData.origenLat.toString();
        updateData.origenLng = distanceData.origenLng.toString();
        updateData.destinoLat = distanceData.destinoLat.toString();
        updateData.destinoLng = distanceData.destinoLng.toString();
        updateData.distanciaKm = distanceData.distanceKm.toString();
        updateData.duracionMinutos = distanceData.durationMinutes.toString();

        // Recalcular fecha de llegada estimada
        const fechaSalidaRef = updateData.fechaSalida || existingRuta.fechaSalida;
        if (fechaSalidaRef) {
          const salida = fechaSalidaRef instanceof Date ? fechaSalidaRef : new Date(fechaSalidaRef);
          updateData.fechaLlegadaEstimada = new Date(salida.getTime() + distanceData.durationMinutes * 60000);
        }
      } catch (error) {
        console.error("Error recalculando distancia:", error);
        const errorMessage = error instanceof Error ? error.message : "No se pudo recalcular la ruta.";
        return NextResponse.json({ error: `Error con OpenStreetMap: ${errorMessage}` }, { status: 400 });
      }
    }

    const [updatedRuta] = await db.update(rutas).set(updateData).where(eq(rutas.id, id)).returning();

    if (!updatedRuta) {
      return NextResponse.json({ error: "Ruta no encontrada para actualizar" }, { status: 404 });
    }

    return NextResponse.json(updatedRuta);
  } catch (error) {
    console.error("Error actualizando ruta:", error);
    return NextResponse.json({ error: "Error al actualizar la ruta" }, { status: 500 });
  }
}

// DELETE - Eliminar ruta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de ruta es requerido" }, { status: 400 });
    }

    const result = await db.delete(rutas).where(eq(rutas.id, id)).returning();
    
    if (result.length === 0) {
        return NextResponse.json({ error: "Ruta no encontrada para eliminar" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ruta eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando ruta:", error);
    return NextResponse.json({ error: "Error al eliminar la ruta" }, { status: 500 });
  }
}