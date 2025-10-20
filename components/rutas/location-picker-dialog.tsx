"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useToast } from "@/hooks/use-toast"

// Importar MapContainer y TileLayer dinámicamente
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

// Componente para manejar los eventos del mapa
function MapClickHandler({ onLocationClick }: { onLocationClick: (lat: number, lng: number) => void }) {
  // Importar useMapEvents directamente dentro del componente
  const { useMapEvents } = require("react-leaflet")
  
  useMapEvents({
    click: (e: any) => {
      onLocationClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface LocationPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
}

export function LocationPickerDialog({ open, onOpenChange, title, onLocationSelect }: LocationPickerDialogProps) {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)

  const boliviaCenter: [number, number] = [-16.5, -68.15]

  useEffect(() => {
    setIsMounted(true)
    import("leaflet/dist/leaflet.css")
  }, [])

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setLoading(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "HydrocarbonTransportApp/1.0",
          },
        },
      )
      const data = await response.json()
      const displayName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      setAddress(displayName)
    } catch (error) {
      console.error("Error getting address:", error)
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=bo&limit=1`,
        {
          headers: {
            "User-Agent": "HydrocarbonTransportApp/1.0",
          },
        },
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        setSelectedLocation({ lat, lng })
        setAddress(result.display_name)
        toast({
          title: "Ubicación encontrada",
          description: result.display_name,
        })
      } else {
        toast({
          title: "No se encontró la ubicación",
          description: "Intenta con otra búsqueda o haz clic en el mapa",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching location:", error)
      toast({
        title: "Error",
        description: "No se pudo buscar la ubicación",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation && address) {
      onLocationSelect({
        address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      })
      onOpenChange(false)
      setSelectedLocation(null)
      setAddress("")
      setSearchQuery("")
    }
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setSelectedLocation(null)
      setAddress("")
      setSearchQuery("")
    }
  }

  if (!isMounted) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Busca una dirección o haz clic en el mapa para seleccionar la ubicación
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar ciudad, calle o lugar en Bolivia..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()} variant="outline">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border shadow-sm h-[400px]">
            <MapContainer center={boliviaCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onLocationClick={handleMapClick} />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
              )}
            </MapContainer>
          </div>

          {selectedLocation && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-vibrant-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Ubicación seleccionada</p>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Obteniendo dirección...</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation || loading}
              className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600"
            >
              Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}