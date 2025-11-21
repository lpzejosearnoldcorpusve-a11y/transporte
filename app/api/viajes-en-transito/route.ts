import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { viajes, vehiculos, conductores } from '@/db/schema'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)

    // Obtener viajes en tránsito con información de vehículo y conductor
    const viajesEnTransito = await db.select({
      id: viajes.id,
      numeroViaje: viajes.numeroViaje,
      vehiculoId: viajes.vehiculoId,
      conductorId: viajes.conductorId,
      producto: viajes.producto,
      cantidad: viajes.cantidad,
      lugarCarga: viajes.lugarCarga,
      lugarDescarga: viajes.lugarDescarga,
      estado: viajes.estado,
      fechaInicio: viajes.fechaInicio,
      fechaFin: viajes.fechaFin,
      vehiculoPlaca: vehiculos.placa,
      vehiculoMarca: vehiculos.marca,
      conductorNombre: conductores.nombre,
      conductorApellido: conductores.apellido
    })
      .from(viajes)
      .leftJoin(vehiculos, eq(viajes.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(viajes.conductorId, conductores.id))
      .where(eq(viajes.estado, 'en_transito'))
      .orderBy(desc(viajes.fechaInicio))
      .limit(10)

    const formattedViajes = viajesEnTransito.map(viaje => ({
      id: viaje.id,
      numeroViaje: viaje.numeroViaje,
      vehiculoId: viaje.vehiculoId,
      conductorId: viaje.conductorId,
      producto: viaje.producto,
      cantidad: viaje.cantidad,
      lugarCarga: viaje.lugarCarga,
      lugarDescarga: viaje.lugarDescarga,
      estado: viaje.estado,
      fechaInicio: viaje.fechaInicio,
      fechaFin: viaje.fechaFin,
      vehiculo: viaje.vehiculoId ? {
        id: viaje.vehiculoId,
        placa: viaje.vehiculoPlaca,
        marca: viaje.vehiculoMarca
      } : null,
      conductor: viaje.conductorId ? {
        id: viaje.conductorId,
        nombre: viaje.conductorNombre,
        apellido: viaje.conductorApellido
      } : null
    }))

    return NextResponse.json(formattedViajes)

  } catch (error) {
    console.error('Error fetching viajes en transito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}