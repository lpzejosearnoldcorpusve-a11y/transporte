// Servicio de OCR usando Tesseract.js o API externa
export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    // Aquí puedes integrar con servicios como:
    // - Google Cloud Vision API
    // - AWS Textract
    // - Azure Computer Vision
    // - Tesseract.js (cliente)

    // Por ahora, simulamos la extracción
    const response = await fetch("/api/ocr/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) throw new Error("Error al procesar OCR")

    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error en OCR:", error)
    throw error
  }
}

export function parseMantenimientoText(text: string): any {
  // Parsear el texto extraído para identificar:
  // - Datos del vehículo
  // - Trabajos realizados
  // - Partes cambiadas
  // - Costos

  const datos: any = {
    vehiculo: {},
    trabajos: [],
    partes: { interiores: [], exteriores: [] },
  }

  // Buscar placa
  const placaMatch = text.match(/placa[:\s]+([A-Z0-9-]+)/i)
  if (placaMatch) datos.vehiculo.placa = placaMatch[1]

  // Buscar marca/modelo
  const marcaMatch = text.match(/marca[:\s]+([^\n]+)/i)
  if (marcaMatch) datos.vehiculo.marca = marcaMatch[1].trim()

  // Buscar trabajos (líneas que empiezan con -, *, o números)
  const trabajosMatch = text.match(/(?:^|\n)[-*•]\s*([^\n]+)/gm)
  if (trabajosMatch) {
    datos.trabajos = trabajosMatch.map((t) => t.replace(/^[-*•]\s*/, "").trim())
  }

  // Buscar costo
  const costoMatch = text.match(/(?:total|costo|precio)[:\s]+(?:S\/|PEN|$)?\s*([\d,]+\.?\d*)/i)
  if (costoMatch) {
    datos.costo = Number.parseFloat(costoMatch[1].replace(/,/g, ""))
  }

  return datos
}
