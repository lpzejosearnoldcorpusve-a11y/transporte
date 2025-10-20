"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import dynamic from "next/dynamic"

// Importar Leaflet dinámicamente
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })

interface RutaMapPreviewProps {
  origen: string
  destino: string
  origenLat?: number
  origenLng?: number
  destinoLat?: number
  destinoLng?: number
  distanciaKm?: number
  duracionMinutos?: number
  geometry?: Array<[number, number]>
}

interface RouteGeometry {
  routes: Array<{
    distance: number
    duration: number
    geometry: {
      type: string
      coordinates: [number, number][] // Array de coordenadas [lng, lat]
    }
  }>
}

export function RutaMapPreview({
  origen,
  destino,
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  distanciaKm,
  duracionMinutos,
  geometry,
}: RutaMapPreviewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([])
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    import("leaflet/dist/leaflet.css")
    
    // Configurar los iconos de Leaflet solo en el cliente
    const configureLeafletIcons = async () => {
      const L = await import("leaflet")
      
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/assets/marker-icon-2x.png",
        shadowUrl: "/assets/marker-shadow.png",
      })
    }

    configureLeafletIcons()
  }, [])

  // Obtener la ruta real por carreteras
  useEffect(() => {
    if (!isMounted || !origenLat || !origenLng || !destinoLat || !destinoLng) return

    const fetchRoute = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origenLng},${origenLat};${destinoLng},${destinoLat}?overview=full&geometries=geojson`
        )
        
        if (!response.ok) throw new Error("Error al obtener la ruta")
        
        const data: RouteGeometry = await response.json()
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          // Convertir GeoJSON a array de coordenadas [lat, lng] y asegurar el tipo
          const geometry = route.geometry.coordinates.map((coord: [number, number]) => 
            [coord[1], coord[0]] as [number, number]
          )
          setRouteGeometry(geometry)
          setRouteInfo({
            distance: route.distance / 1000, // metros a km
            duration: route.duration / 60 // segundos a minutos
          })
        }
      } catch (error) {
        console.error("Error fetching route:", error)
        // En caso de error, usar línea recta como fallback
        setRouteGeometry([
          [origenLat, origenLng],
          [destinoLat, destinoLng]
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRoute()
  }, [isMounted, origenLat, origenLng, destinoLat, destinoLng])

  if (!isMounted || !origenLat || !origenLng || !destinoLat || !destinoLng) {
    return (
      <Card className="p-4 bg-muted flex items-center justify-center h-[400px]">
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </Card>
    )
  }

  // Calcular el centro del mapa
  const centerLat = (origenLat + destinoLat) / 2
  const centerLng = (origenLng + destinoLng) / 2

  return (
    <div className="space-y-6">
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg h-[450px] group">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[origenLat, origenLng]}>
            <Popup>
              <div className="text-center">
                <strong className="text-forest-green-700 text-base">📍 Origen</strong>
                <p className="text-sm mt-1">{origen}</p>
              </div>
            </Popup>
          </Marker>
          <Marker position={[destinoLat, destinoLng]}>
            <Popup>
              <div className="text-center">
                <strong className="text-vibrant-orange-700 text-base">🎯 Destino</strong>
                <p className="text-sm mt-1">{destino}</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Línea de ruta por carreteras */}
          {routeGeometry.length > 0 && (
            <Polyline 
              positions={routeGeometry} 
              color="#10b981" 
              weight={6} 
              opacity={0.85}
            />
          )}
          
          {/* Mostrar línea recta solo mientras carga o si hay error */}
          {loading && (
            <Polyline
              positions={[
                [origenLat, origenLng],
                [destinoLat, destinoLng],
              ]}
              color="#94a3b8"
              weight={3}
              dashArray="8, 12"
              opacity={0.6}
            />
          )}
        </MapContainer>
        
        {/* Badge flotante de carga */}
        {loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 z-[1000]">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Calculando ruta...</span>
          </div>
        )}
      </div>

      {/* Tarjetas de información mejoradas */}
      {(routeInfo?.distance || routeInfo?.duration || distanciaKm || duracionMinutos) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 opacity-10 group-hover:opacity-15 transition-opacity"></div>
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Distancia total</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {routeInfo ? routeInfo.distance.toFixed(1) : distanciaKm} <span className="text-xl">km</span>
                    </p>
                  </div>
                </div>
              </div>
              {routeInfo && distanciaKm && Math.abs(routeInfo.distance - distanciaKm) > 0.1 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    📏 Estimado original: <span className="font-medium">{distanciaKm} km</span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 opacity-10 group-hover:opacity-15 transition-opacity"></div>
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tiempo estimado</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      {routeInfo 
                        ? Math.floor(routeInfo.duration / 60) > 0 
                          ? `${Math.floor(routeInfo.duration / 60)}h ${Math.round(routeInfo.duration % 60)}m`
                          : `${Math.round(routeInfo.duration)}m`
                        : Math.floor(Number(duracionMinutos) / 60) > 0
                          ? `${Math.floor(Number(duracionMinutos) / 60)}h ${Number(duracionMinutos) % 60}m`
                          : `${Number(duracionMinutos)}m`
                      }
                    </p>
                  </div>
                </div>
              </div>
              {routeInfo && duracionMinutos && Math.abs(routeInfo.duration - duracionMinutos) > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    ⏱️ Estimado original: <span className="font-medium">
                      {Math.floor(Number(duracionMinutos) / 60)}h {Number(duracionMinutos) % 60}m
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Sección de ubicaciones con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-2xl">📍</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-700 text-sm uppercase tracking-wide mb-1">Punto de Origen</p>
              <p className="text-gray-900 font-medium mb-2 truncate">{origen}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-white rounded-md font-mono">
                  {origenLat.toFixed(4)}°, {origenLng.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-2xl">🎯</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-orange-700 text-sm uppercase tracking-wide mb-1">Punto de Destino</p>
              <p className="text-gray-900 font-medium mb-2 truncate">{destino}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-white rounded-md font-mono">
                  {destinoLat.toFixed(4)}°, {destinoLng.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}