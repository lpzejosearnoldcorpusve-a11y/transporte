"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface PartesCambiadasSectionProps {
  partesInteriores: string[]
  partesExteriores: string[]
  onAddParte: (tipo: "interiores" | "exteriores", parte: string) => void
  onRemoveParte: (tipo: "interiores" | "exteriores", index: number) => void
}

export function PartesCambiadasSection({
  partesInteriores,
  partesExteriores,
  onAddParte,
  onRemoveParte,
}: PartesCambiadasSectionProps) {
  const [newParteInterior, setNewParteInterior] = useState("")
  const [newParteExterior, setNewParteExterior] = useState("")

  const handleAddInterior = () => {
    if (newParteInterior.trim()) {
      onAddParte("interiores", newParteInterior.trim())
      setNewParteInterior("")
    }
  }

  const handleAddExterior = () => {
    if (newParteExterior.trim()) {
      onAddParte("exteriores", newParteExterior.trim())
      setNewParteExterior("")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Partes interiores */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Partes Interiores Cambiadas</Label>

        <div className="flex gap-2">
          <Input
            placeholder="Ej: Asientos, Volante..."
            value={newParteInterior}
            onChange={(e) => setNewParteInterior(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterior())}
          />
          <Button
            type="button"
            onClick={handleAddInterior}
            size="sm"
            className="bg-forest-green-600 hover:bg-forest-green-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-gray-200 bg-gray-50">
          <AnimatePresence>
            {partesInteriores.map((parte, index) => (
              <motion.div
                key={`interior-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge variant="default" className="gap-1 pr-1 text-sm">
                  {parte}
                  <button
                    type="button"
                    onClick={() => onRemoveParte("interiores", index)}
                    className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          {partesInteriores.length === 0 && (
            <p className="text-sm text-gray-400 italic">No hay partes interiores agregadas</p>
          )}
        </div>
      </div>

      {/* Partes exteriores */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Partes Exteriores Cambiadas</Label>

        <div className="flex gap-2">
          <Input
            placeholder="Ej: Parachoques, Faros..."
            value={newParteExterior}
            onChange={(e) => setNewParteExterior(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExterior())}
          />
          <Button
            type="button"
            onClick={handleAddExterior}
            size="sm"
            className="bg-forest-green-600 hover:bg-forest-green-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-gray-200 bg-gray-50">
          <AnimatePresence>
            {partesExteriores.map((parte, index) => (
              <motion.div
                key={`exterior-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge variant="default" className="gap-1 pr-1 text-sm">
                  {parte}
                  <button
                    type="button"
                    onClick={() => onRemoveParte("exteriores", index)}
                    className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          {partesExteriores.length === 0 && (
            <p className="text-sm text-gray-400 italic">No hay partes exteriores agregadas</p>
          )}
        </div>
      </div>
    </div>
  )
}
