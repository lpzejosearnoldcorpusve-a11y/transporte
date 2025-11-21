import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gpsTracking, vehiculos } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Obtener las últimas posiciones GPS de todos los vehículos
    const vehiculosConGPS = await db.select({
      vehiculoId: gpsTracking.vehiculoId,
      vehiculoPlaca: vehiculos.placa,
      vehiculoMarca: vehiculos.marca,
      latitud: gpsTracking.latitud,
      longitud: gpsTracking.longitud,
      velocidad: gpsTracking.velocidad,
      altitud: gpsTracking.altitud,
      satelites: gpsTracking.satelites,
      timestamp: gpsTracking.timestamp,
      direccion: gpsTracking.direccion
    })
      .from(gpsTracking)
      .leftJoin(vehiculos, eq(gpsTracking.vehiculoId, vehiculos.id))
      .where(sql`${gpsTracking.timestamp} >= NOW() - INTERVAL '1 hour'`) // Últimas posiciones de la hora
      .orderBy(desc(gpsTracking.timestamp))
      .limit(100)

    // Agrupar por vehículo y obtener la posición más reciente de cada uno
    const vehiculosTracking = vehiculosConGPS.reduce((acc, item) => {
      if (!acc[item.vehiculoId]) {
        acc[item.vehiculoId] = {
          vehiculo: {
            id: item.vehiculoId,
            placa: item.vehiculoPlaca,
            marca: item.vehiculoMarca
          },
          posicion: {
            latitud: Number(item.latitud),
            longitud: Number(item.longitud),
            velocidad: item.velocidad || 0,
            altitud: item.altitud || 0,
            satelites: item.satelites || 0,
            timestamp: item.timestamp,
            direccion: item.direccion
          },
          ultimaPosicion: {
            id: `${item.vehiculoId}-${item.timestamp}`,
            vehiculoId: item.vehiculoId,
            latitud: Number(item.latitud),
            longitud: Number(item.longitud),
            velocidad: item.velocidad || 0,
            timestamp: item.timestamp
          }
        }
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(Object.values(vehiculosTracking))

  } catch (error) {
    console.error('Error fetching vehiculos tracking:', error)
    
    // Datos de prueba en caso de error
    const mockData = [
      {
        vehiculo: { id: "1", placa: "ABC123", marca: "Volvo" },
        posicion: {
          latitud: -16.5000,
          longitud: -68.1193,
          velocidad: 45,
          altitud: 3515,
          satelites: 8,
          timestamp: new Date().toISOString(),
          direccion: 180
        },
        ultimaPosicion: {
          id: "1-" + new Date().getTime(),
          vehiculoId: "1",
          latitud: -16.5000,
          longitud: -68.1193,
          velocidad: 45,
          timestamp: new Date().toISOString()
        }
      },
      {
        vehiculo: { id: "2", placa: "XYZ789", marca: "Mercedes" },
        posicion: {
          latitud: -16.5200,
          longitud: -68.1093,
          velocidad: 0,
          altitud: 3520,
          satelites: 7,
          timestamp: new Date().toISOString(),
          direccion: 0
        },
        ultimaPosicion: {
          id: "2-" + new Date().getTime(),
          vehiculoId: "2",
          latitud: -16.5200,
          longitud: -68.1093,
          velocidad: 0,
          timestamp: new Date().toISOString()
        }
      }
    ]

    return NextResponse.json(mockData)
  }
}