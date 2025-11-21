"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, RefreshCw, Car, Satellite, Fuel, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import dynamic from "next/dynamic"

// Importar el mapa dinámicamente para evitar errores SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface VehiculoTracking {
  vehiculo: {
    id: string
    placa: string
    marca: string
  }
  posicion: {
    latitud: number
    longitud: number
    velocidad: number
    altitud: number
    satelites: number
    timestamp: string
  }
  ultimaPosicion: {
    id: string
    vehiculoId: string
    latitud: number
    longitud: number
    velocidad: number
    timestamp: string
  }
}

interface DashboardMapaVivoProps {
  vehiculosTracking: VehiculoTracking[]
  isLoading: boolean
  onRefresh?: () => void
}

// Componente del mapa interno
function MapaInteractivo({ vehiculosTracking }: { vehiculosTracking: VehiculoTracking[] }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Configurar iconos de Leaflet
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [])

  if (!isMounted) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Inicializando mapa...</p>
        </div>
      </div>
    )
  }

  const defaultCenter: [number, number] = [-16.5, -68.1] // La Paz, Bolivia
  const center = vehiculosTracking.length > 0 
    ? [vehiculosTracking[0].posicion.latitud, vehiculosTracking[0].posicion.longitud] as [number, number]
    : defaultCenter

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vehiculosTracking.map((vehiculo, index) => {
          const velocidad = vehiculo.posicion.velocidad
          const estadoColor = velocidad === 0 ? 'text-red-500' : velocidad < 30 ? 'text-yellow-500' : 'text-green-500'
          
          return (
            <Marker
              key={vehiculo.vehiculo.id}
              position={[vehiculo.posicion.latitud, vehiculo.posicion.longitud]}
            >
              <Popup>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 min-w-[250px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800">{vehiculo.vehiculo.placa}</h3>
                    <div className={`flex items-center ${estadoColor}`}>
                      <Car className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {velocidad === 0 ? 'Detenido' : velocidad < 30 ? 'Lento' : 'Normal'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">Marca:</span>
                      <span className="font-medium">{vehiculo.vehiculo.marca}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        Velocidad:
                      </span>
                      <span className="font-bold text-blue-700">{velocidad} km/h</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Satellite className="h-3 w-3 mr-1" />
                        Satélites:
                      </span>
                      <span className="font-medium text-green-700">{vehiculo.posicion.satelites}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                      <span className="text-sm text-gray-600">Altitud:</span>
                      <span className="font-medium text-purple-700">{vehiculo.posicion.altitud}m</span>
                    </div>
                    
                    <div className="bg-gray-100 p-2 rounded mt-3">
                      <span className="text-xs text-gray-500">Última actualización:</span>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(vehiculo.posicion.timestamp).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* Overlay de información */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10"
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">En movimiento</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Lento</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Detenido</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function DashboardMapaVivo({ vehiculosTracking, isLoading, onRefresh }: DashboardMapaVivoProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [animateCount, setAnimateCount] = useState(0)

  useEffect(() => {
    if (vehiculosTracking.length > 0) {
      setLastUpdate(new Date())
      setAnimateCount(prev => prev + 1)
    }
  }, [vehiculosTracking])

  const vehiculosEnMovimiento = vehiculosTracking.filter(v => v.posicion.velocidad > 0)
  const vehiculosDetenidos = vehiculosTracking.filter(v => v.posicion.velocidad === 0)
  const velocidadPromedio = vehiculosTracking.length > 0 
    ? Math.round(vehiculosTracking.reduce((acc, v) => acc + v.posicion.velocidad, 0) / vehiculosTracking.length)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full"
    >
      <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3">
          <div className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-bold text-forest-green-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-vibrant-orange-600" />
                Mapa en Vivo
                <motion.div
                  key={animateCount}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="ml-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </motion.div>
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Seguimiento GPS de {vehiculosTracking.length} vehículo{vehiculosTracking.length !== 1 ? 's' : ''} en tiempo real
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {onRefresh && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      disabled={isLoading}
                      className="flex items-center space-x-2 hover:bg-vibrant-orange-50 border-vibrant-orange-200"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} text-vibrant-orange-600`} />
                      <span>Actualizar</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Badge variant="default" className="bg-vibrant-orange-100 text-vibrant-orange-800 border-vibrant-orange-200">
                <Satellite className="h-3 w-3 mr-1" />
                {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </Badge>
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-4"
          >
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">En Movimiento</p>
                  <p className="text-lg font-bold text-green-700">{vehiculosEnMovimiento.length}</p>
                </div>
                <Car className="h-5 w-5 text-green-500" />
              </div>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-medium">Detenidos</p>
                  <p className="text-lg font-bold text-red-700">{vehiculosDetenidos.length}</p>
                </div>
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Vel. Promedio</p>
                  <p className="text-lg font-bold text-blue-700">{velocidadPromedio} km/h</p>
                </div>
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {vehiculosTracking.length > 0 ? (
              <MapaInteractivo vehiculosTracking={vehiculosTracking} />
            ) : (
              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium mb-2">Sin vehículos en línea</p>
                  <p className="text-sm text-gray-500">Los vehículos aparecerán aquí cuando estén activos</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}