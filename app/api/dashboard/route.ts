import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehiculos, conductores, viajes, rutas, mantenimientos, gpsTracking, dispositivosGps } from '@/db/schema'
import { eq, and, gte, lte, desc, sql, count } from 'drizzle-orm'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)
    const last7Days = subDays(today, 7)

    // Estadísticas principales
    const [vehiculosActivosResult] = await db.select({ count: sql<number>`count(*)` })
      .from(vehiculos)
      .where(eq(vehiculos.estado, 'activo'))

    const [viajesHoyResult] = await db.select({ count: sql<number>`count(*)` })
      .from(viajes)
      .where(and(
        gte(viajes.fechaInicio, startOfToday),
        lte(viajes.fechaInicio, endOfToday)
      ))

    const [viajesEnTransitoResult] = await db.select({ count: sql<number>`count(*)` })
      .from(viajes)
      .where(eq(viajes.estado, 'en_transito'))

    const [conductoresActivosResult] = await db.select({ count: sql<number>`count(*)` })
      .from(conductores)

    const [mantenimientosEnProcesoResult] = await db.select({ count: sql<number>`count(*)` })
      .from(mantenimientos)
      .where(eq(mantenimientos.estado, 'en_proceso'))

    // Estado de la flota
    const estadoFlotaData = await db.select({
      estado: vehiculos.estado,
      count: sql<number>`count(*)`
    })
      .from(vehiculos)
      .groupBy(vehiculos.estado)

    const estadoFlota = {
      items: estadoFlotaData.map(item => ({
        name: item.estado || 'Sin estado',
        value: item.count,
        color: getEstadoColor(item.estado || undefined)
      })),
      total: estadoFlotaData.reduce((acc, item) => acc + item.count, 0)
    }

    // Viajes por día (últimos 7 días)
    const viajesPorDiaData = await db.select({
      fecha: sql<string>`DATE(${viajes.fechaInicio})`,
      count: sql<number>`count(*)`
    })
      .from(viajes)
      .where(gte(viajes.fechaInicio, last7Days))
      .groupBy(sql`DATE(${viajes.fechaInicio})`)
      .orderBy(sql`DATE(${viajes.fechaInicio})`)

    const viajesPorDia = viajesPorDiaData.map(item => ({
      fecha: item.fecha,
      viajes: item.count
    }))

    // Litros por producto (últimos 30 días)
    const last30Days = subDays(today, 30)
    const litrosPorProductoData = await db.select({
      producto: viajes.producto,
      totalLitros: sql<number>`SUM(${viajes.cantidad})`
    })
      .from(viajes)
      .where(gte(viajes.fechaInicio, last30Days))
      .groupBy(viajes.producto)
      .orderBy(desc(sql`SUM(${viajes.cantidad})`))

    const litrosPorProducto = litrosPorProductoData.map(item => ({
      producto: item.producto || 'Sin especificar',
      litros: item.totalLitros || 0
    }))

    // Alertas (simuladas)
    const alertas = [
      { tipo: "Velocidad", count: 3, icon: "AlertTriangle", color: "text-red-600" },
      { tipo: "GPS", count: 1, icon: "Satellite", color: "text-orange-600" },
      { tipo: "Mantenimiento", count: 5, icon: "Wrench", color: "text-yellow-600" },
      { tipo: "Combustible", count: 2, icon: "Fuel", color: "text-blue-600" }
    ]

    // Actividad reciente (simulada)
    const actividadReciente = [
      {
        tipo: "viaje",
        descripcion: "Viaje V001 completado exitosamente",
        tiempo: "5 minutos ago",
        icon: "CheckCircle"
      },
      {
        tipo: "mantenimiento",
        descripcion: "Mantenimiento M003 iniciado",
        tiempo: "15 minutos ago",
        icon: "Wrench"
      },
      {
        tipo: "alerta",
        descripcion: "Alerta de velocidad en vehículo ABC123",
        tiempo: "30 minutos ago",
        icon: "AlertTriangle"
      },
      {
        tipo: "conductor",
        descripcion: "Nuevo conductor registrado",
        tiempo: "1 hora ago",
        icon: "UserPlus"
      },
      {
        tipo: "ruta",
        descripcion: "Ruta 005 actualizada",
        tiempo: "3 horas ago",
        icon: "Route"
      }
    ]

    return NextResponse.json({
      stats: {
        vehiculosActivos: vehiculosActivosResult.count,
        viajesHoy: viajesHoyResult.count,
        viajesEnTransito: viajesEnTransitoResult.count,
        conductoresActivos: conductoresActivosResult.count,
        mantenimientosEnProceso: mantenimientosEnProcesoResult.count,
        alertasGps: 0 // TODO: implementar lógica GPS
      },
      estadoFlota,
      viajesPorDia,
      litrosPorProducto,
      alertas,
      actividadReciente
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getEstadoColor(estado?: string): string {
  switch (estado) {
    case 'activo': return '#10B981'
    case 'mantenimiento': return '#F59E0B'
    case 'inactivo': return '#EF4444'
    default: return '#6B7280'
  }
}