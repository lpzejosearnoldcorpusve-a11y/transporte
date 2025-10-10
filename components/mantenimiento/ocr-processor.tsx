"use client"

import { motion } from "framer-motion"
import { Loader2, Wrench, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface OcrProcessorProps {
  fichasCount: number
  isProcessing: boolean
  isCompleted: boolean
  hasError: boolean
  onProcess: () => void
}

export function OcrProcessor({ fichasCount, isProcessing, isCompleted, hasError, onProcess }: OcrProcessorProps) {
  if (fichasCount === 0) return null

  return (
    <div className="space-y-3">
      {!isCompleted && !hasError && (
        <Button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="w-full bg-forest-green-600 hover:bg-forest-green-700 text-white font-semibold py-6"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando con OCR...
            </>
          ) : (
            <>
              <Wrench className="mr-2 h-5 w-5" />
              Procesar Fichas con OCR
            </>
          )}
        </Button>
      )}

      {isProcessing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <Progress value={66} className="h-2" />
          <p className="text-xs text-center text-gray-600">Extrayendo información de las fichas...</p>
        </motion.div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200"
        >
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Fichas procesadas correctamente</p>
            <p className="text-sm text-green-600">Los datos han sido extraídos y cargados en el formulario</p>
          </div>
        </motion.div>
      )}

      {hasError && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200"
        >
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800">Error al procesar las fichas</p>
            <p className="text-sm text-red-600">Por favor, intenta nuevamente o completa manualmente</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
