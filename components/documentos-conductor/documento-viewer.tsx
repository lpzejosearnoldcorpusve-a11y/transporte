"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, FileText, File, AlertCircle } from "lucide-react"

interface DocumentoConductor {
  nombreArchivo: string
  tipoArchivo: string
  urlArchivo: string
}

interface DocumentoViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: DocumentoConductor | null
}

export function DocumentoViewer({ open, onOpenChange, documento }: DocumentoViewerProps) {
  const [pdfError, setPdfError] = useState(false)
  
  if (!documento) return null

  const isImage = documento.tipoArchivo.startsWith("image/")
  const isPdf = documento.tipoArchivo === "application/pdf"

  const getFileIcon = () => {
    if (isImage) return <FileText className="h-5 w-5" />
    if (isPdf) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = documento.urlArchivo
    a.download = documento.nombreArchivo
    a.click()
  }

  // Construir URL para preview de PDF en Cloudinary
  const getPdfPreviewUrl = () => {
    const url = documento.urlArchivo
    
    // Si es de Cloudinary, convertir primera página a imagen
    if (url.includes('cloudinary.com')) {
      // Extraer public_id de la URL
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
      if (match) {
        const publicId = match[1]
        // Construir URL con transformación a JPG de primera página
        const baseUrl = url.split('/upload/')[0]
        return `${baseUrl}/upload/pg_1,f_jpg,q_auto,w_1000/${publicId}.jpg`
      }
    }
    
    return url
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {getFileIcon()}
              </div>
              <div>
                <DialogHeader>
                  <DialogTitle>
                    {documento.nombreArchivo}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mt-1">
                  {documento.tipoArchivo}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(documento.urlArchivo, "_blank")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hover:bg-green-50 dark:hover:bg-green-950/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido del documento */}
        <div className="overflow-auto bg-gray-50 dark:bg-gray-900/50" style={{ height: 'calc(95vh - 100px)' }}>
          {isImage && (
            <div className="flex items-center justify-center p-8 min-h-full">
              <img
                src={documento.urlArchivo || "/placeholder.svg"}
                alt={documento.nombreArchivo}
                className="max-w-full h-auto rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {isPdf && !pdfError && (
            <div className="w-full h-full p-4">
              {/* Mostrar primera página del PDF como imagen */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-500">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">
                    Vista previa de la primera página
                  </p>
                </div>
                
                <img
                  src={getPdfPreviewUrl()}
                  alt="Preview del PDF"
                  className="w-full h-auto rounded border border-gray-200 dark:border-gray-700"
                  onError={() => setPdfError(true)}
                />
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Para ver el documento completo, ábrelo en una nueva pestaña o descárgalo.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.open(documento.urlArchivo, "_blank")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver PDF completo
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(isPdf && pdfError) && (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
                <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No se puede previsualizar el PDF
                </h3>
                <p className="text-muted-foreground mb-6">
                  Este PDF debe abrirse en una nueva pestaña o descargarse para visualizarlo.
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => window.open(documento.urlArchivo, "_blank")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir PDF
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isImage && !isPdf && (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-fit mx-auto mb-4">
                  <File className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Vista previa no disponible
                </h3>
                <p className="text-muted-foreground mb-6">
                  Este tipo de archivo no se puede previsualizar en el navegador
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => window.open(documento.urlArchivo, "_blank")}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir archivo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar archivo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}