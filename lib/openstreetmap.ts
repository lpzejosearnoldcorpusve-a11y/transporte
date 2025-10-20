export interface RouteResult {
  distanceKm: number
  durationMinutes: number
  origenLat: number
  origenLng: number
  destinoLat: number
  destinoLng: number
  geometry: Array<[number, number]>
}

/**
 * Geocodifica una dirección usando Nominatim (servicio de geocoding de OpenStreetMap)
 * Es gratuito y no requiere API key
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "HydrocarbonTransportApp/1.0",
      },
    })

    const data = await response.json()

    if (!data || data.length === 0) {
      throw new Error(`No se pudo geocodificar la dirección: ${address}`)
    }

    return {
      lat: Number.parseFloat(data[0].lat),
      lng: Number.parseFloat(data[0].lon),
    }
  } catch (error) {
    console.error("Error en geocoding:", error)
    throw new Error("Error al geocodificar la dirección")
  }
}

/**
 * Calcula la distancia y duración de una ruta usando OSRM (Open Source Routing Machine)
 * Es gratuito y no requiere API key
 */
export async function calculateRouteDistance(origen: string, destino: string): Promise<RouteResult> {
  try {
    // Primero geocodificar origen y destino
    const [origenGeo, destinoGeo] = await Promise.all([geocodeAddress(origen), geocodeAddress(destino)])

    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origenGeo.lng},${origenGeo.lat};${destinoGeo.lng},${destinoGeo.lat}?overview=full&geometries=geojson`

    const response = await fetch(routeUrl)
    const data = await response.json()

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error("No se pudo calcular la ruta")
    }

    const route = data.routes[0]

    const geometry: Array<[number, number]> = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])

    return {
      distanceKm: Math.round(route.distance / 1000),
      durationMinutes: Math.round(route.duration / 60),
      origenLat: origenGeo.lat,
      origenLng: origenGeo.lng,
      destinoLat: destinoGeo.lat,
      destinoLng: destinoGeo.lng,
      geometry,
    }
  } catch (error) {
    console.error("Error calculando ruta:", error)
    throw new Error("Error al calcular la ruta")
  }
}

/**
 * Calcula ruta usando coordenadas directamente (sin geocodificación)
 */
export async function calculateRouteFromCoordinates(
  origenLat: number,
  origenLng: number,
  destinoLat: number,
  destinoLng: number,
): Promise<RouteResult> {
  try {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origenLng},${origenLat};${destinoLng},${destinoLat}?overview=full&geometries=geojson`

    const response = await fetch(routeUrl)
    const data = await response.json()

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error("No se pudo calcular la ruta")
    }

    const route = data.routes[0]

    const geometry: Array<[number, number]> = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])

    return {
      distanceKm: Math.round(route.distance / 1000),
      durationMinutes: Math.round(route.duration / 60),
      origenLat,
      origenLng,
      destinoLat,
      destinoLng,
      geometry,
    }
  } catch (error) {
    console.error("Error calculando ruta:", error)
    throw new Error("Error al calcular la ruta")
  }
}

/**
 * Obtiene la ubicación actual del usuario usando la API de Geolocation del navegador
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation no está soportado por este navegador"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
    )
  })
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * Útil para cálculos rápidos sin necesidad de API
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): { distanceKm: number } {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = R * c

  return { distanceKm: Math.round(distanceKm) }
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
