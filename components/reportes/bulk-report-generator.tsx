"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, AlertCircle, CheckCircle, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BulkReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
}

interface ReportType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const reportTypes: ReportType[] = [
  {
    id: "conductores",
    name: "Conductores",
    description: "Reportes de conductores, licencias y documentación",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "rutas",
    name: "Rutas",
    description: "Análisis de rutas, distancias y tiempos",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "gps",
    name: "GPS Tracking",
    description: "Reportes de ubicación y alertas GPS",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "vehiculos",
    name: "Vehículos",
    description: "Estado de flota y documentación vehicular",
    icon: <FileText className="h-4 w-4" />,
  },
]

export function BulkReportGenerator({ isOpen, onClose }: BulkReportGeneratorProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>(["conductores"])
  const [incluirEstadisticas, setIncluirEstadisticas] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleGenerateReports = async () => {
    if (selectedReports.length === 0) {
      alert("Seleccione al menos un tipo de reporte")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setResults(null)

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/reportes/generar-lote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipos: selectedReports,
          incluirEstadisticas
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResults(data)
        
        // Descargar archivos exitosos
        data.reportes.forEach((reporte: any) => {
          if (reporte.success) {
            const blob = new Blob([
              Uint8Array.from(atob(reporte.data), c => c.charCodeAt(0))
            ], { type: 'application/pdf' })
            
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = reporte.filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }
        })
        
      } else {
        throw new Error(data.error || "Error al generar reportes")
      }

    } catch (error) {
      console.error("Error generating bulk reports:", error)
      setResults({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      })
    } finally {
      setIsGenerating(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const handleSelectAll = () => {
    setSelectedReports(selectedReports.length === reportTypes.length ? [] : reportTypes.map(r => r.id))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-forest-green-600" />
                Generación de Reportes en Lote
              </CardTitle>
              <CardDescription>
                Seleccione los tipos de reportes que desea generar simultáneamente (máximo 10)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generando reportes...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="space-y-3">
                  {results.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">{results.mensaje}</span>
                      </div>
                      
                      {results.reportes.map((reporte: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="capitalize">{reporte.tipo}</span>
                          </div>
                          {reporte.success ? (
                            <Badge className="bg-green-500 text-white">
                              <Download className="h-3 w-3 mr-1" />
                              Descargado
                            </Badge>
                          ) : (
                            <Badge variant="danger">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 rounded">
                      <AlertCircle className="h-4 w-4" />
                      <span>{results.error}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Report Selection */}
              {!isGenerating && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Tipos de Reportes</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedReports.length === reportTypes.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {reportTypes.map((reportType) => (
                      <div
                        key={reportType.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedReports.includes(reportType.id)
                            ? "border-forest-green-300 bg-forest-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleReportToggle(reportType.id)}
                      >
                        <Checkbox
                          checked={selectedReports.includes(reportType.id)}
                          onChange={() => handleReportToggle(reportType.id)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {reportType.icon}
                          <div>
                            <div className="font-medium">{reportType.name}</div>
                            <div className="text-sm text-gray-500">{reportType.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {!isGenerating && (
                <div className="space-y-3">
                  <h4 className="font-medium">Opciones</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={incluirEstadisticas}
                      onChange={() => setIncluirEstadisticas(!incluirEstadisticas)}
                    />
                    <label className="text-sm">Incluir reporte consolidado con estadísticas</label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerateReports}
                  disabled={selectedReports.length === 0 || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    "Generando..."
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Generar {selectedReports.length} Reporte(s)
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                  {isGenerating ? "Procesando..." : "Cerrar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}