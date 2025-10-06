export interface DistanceMatrixResult {
  distanceKm: number
  durationMinutes: number
  origenLat: number
  origenLng: number
  destinoLat: number
  destinoLng: number
}

export async function calculateRouteDistance(origen: string, destino: string): Promise<DistanceMatrixResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY no está configurada")
  }

  try {
    // Primero geocodificar origen y destino para obtener coordenadas
    const [origenGeo, destinoGeo] = await Promise.all([geocodeAddress(origen, apiKey), geocodeAddress(destino, apiKey)])

    // Luego calcular distancia y duración
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origen)}&destinations=${encodeURIComponent(destino)}&key=${apiKey}`

    const response = await fetch(distanceUrl)
    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error(`Google Maps API error: ${data.status}`)
    }

    const element = data.rows[0]?.elements[0]

    if (!element || element.status !== "OK") {
      throw new Error("No se pudo calcular la distancia")
    }

    return {
      distanceKm: Math.round(element.distance.value / 1000), // metros a km
      durationMinutes: Math.round(element.duration.value / 60), // segundos a minutos
      origenLat: origenGeo.lat,
      origenLng: origenGeo.lng,
      destinoLat: destinoGeo.lat,
      destinoLng: destinoGeo.lng,
    }
  } catch (error) {
    console.error("Error calculando distancia:", error)
    throw new Error("Error al calcular la distancia con Google Maps")
  }
}

async function geocodeAddress(address: string, apiKey: string): Promise<{ lat: number; lng: number }> {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  const response = await fetch(geocodeUrl)
  const data = await response.json()

  if (data.status !== "OK" || !data.results[0]) {
    throw new Error(`No se pudo geocodificar la dirección: ${address}`)
  }

  const location = data.results[0].geometry.location

  return {
    lat: location.lat,
    lng: location.lng,
  }
}

export function getEmbedMapUrl(origen: string, destino: string): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return ""

  return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&mode=driving`
}

export function getStaticMapUrl(
  origenLat: number,
  origenLng: number,
  destinoLat: number,
  destinoLng: number,
  width = 600,
  height = 300,
): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return ""

  const markers = `markers=color:green|label:O|${origenLat},${origenLng}&markers=color:red|label:D|${destinoLat},${destinoLng}`
  const path = `path=color:0x0088ff|weight:3|${origenLat},${origenLng}|${destinoLat},${destinoLng}`

  return `https://maps.googleapis.com/maps/api/staticmap?${markers}&${path}&size=${width}x${height}&key=${apiKey}`
}

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

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY no está configurada")

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.status !== "OK" || !data.results[0]) {
    throw new Error("No se pudo obtener la dirección")
  }

  return data.results[0].formatted_address
}
