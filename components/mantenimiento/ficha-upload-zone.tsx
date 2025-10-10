"use client"

import type React from "react"

import { Upload } from "lucide-react"
import { motion } from "framer-motion"

interface FichaUploadZoneProps {
  fichasCount: number
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FichaUploadZone({ fichasCount, onFileChange }: FichaUploadZoneProps) {
  const isDisabled = fichasCount >= 5

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
        isDisabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-vibrant-orange-500 hover:bg-vibrant-orange-50 cursor-pointer"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
        id="fichas-upload"
        disabled={isDisabled}
      />
      <label htmlFor="fichas-upload" className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}>
        <Upload className={`mx-auto h-16 w-16 mb-4 ${isDisabled ? "text-gray-300" : "text-gray-400"}`} />
        <p className={`text-base font-medium mb-1 ${isDisabled ? "text-gray-400" : "text-gray-700"}`}>
          {isDisabled ? "Límite alcanzado" : "Haz clic para subir o arrastra las fichas aquí"}
        </p>
        <p className="text-sm text-gray-500">{fichasCount}/5 fichas subidas • PNG, JPG hasta 10MB</p>
      </label>
    </motion.div>
  )
}
