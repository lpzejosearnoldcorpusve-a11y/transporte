import { db } from "@/db/index"
import { viajes, vehiculos, conductores, rutas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import jsPDF from "jspdf"
import QRCode from "qrcode"

// Interfaz para datos validados
interface ViajeCompleto {
  viaje: typeof viajes.$inferSelect
  vehiculo: typeof vehiculos.$inferSelect | null
  conductor: typeof conductores.$inferSelect | null
  ruta: typeof rutas.$inferSelect | null
}

// Validación de coordenadas
function validarCoordenadas(lat: number | null, lng: number | null): boolean {
  if (lat === null || lng === null) return false
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// Generar URL de mapa con validación
function generarURLMapa(
  origenLat: number,
  origenLng: number,
  destinoLat: number,
  destinoLng: number
): string {
  // Validar coordenadas antes de generar URL
  if (!validarCoordenadas(origenLat, origenLng) || !validarCoordenadas(destinoLat, destinoLng)) {
    throw new Error("Coordenadas inválidas")
  }

  // URL de Google Maps (más compatible y usado)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origenLat},${origenLng}&destination=${destinoLat},${destinoLng}&travelmode=driving`
  
  return googleMapsUrl
}

// Formatear fecha de manera segura
function formatearFecha(fecha: string | Date | null): string {
  if (!fecha) return "No especificada"
  
  try {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
    if (isNaN(fechaObj.getTime())) return "Fecha inválida"
    
    return fechaObj.toLocaleString("es-BO", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return "Error en formato de fecha"
  }
}

// Función para dibujar header con estilo
function dibujarHeader(pdf: jsPDF, numeroViaje: string, pageWidth: number): number {
  let y = 15
  
  // Fondo del header
  pdf.setFillColor(20, 70, 50)
  pdf.rect(0, 0, pageWidth, 35, 'F')
  
  // Título principal
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text("HOJA DE RUTA", pageWidth / 2, y + 8, { align: "center" })
  
  // Número de viaje
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`N° ${numeroViaje}`, pageWidth / 2, y + 18, { align: "center" })
  
  return 45
}

// Función para dibujar sección con estilo
function dibujarSeccion(
  pdf: jsPDF,
  titulo: string,
  y: number,
  pageWidth: number,
  pageHeight: number
): number {
  if (y + 15 > pageHeight - 20) {
    pdf.addPage()
    y = 20
  }
  
  // Línea superior
  pdf.setDrawColor(20, 70, 50)
  pdf.setLineWidth(0.5)
  pdf.line(15, y, pageWidth - 15, y)
  y += 5
  
  // Título de sección
  pdf.setFontSize(13)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(20, 70, 50)
  pdf.text(titulo, 20, y)
  y += 8
  
  return y
}

// Función para agregar campo con etiqueta
function agregarCampo(
  pdf: jsPDF,
  etiqueta: string,
  valor: string,
  x: number,
  y: number,
  pageWidth: number,
  pageHeight: number
): number {
  if (y > pageHeight - 15) {
    pdf.addPage()
    y = 20
  }
  
  // Etiqueta en negrita
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  pdf.text(`${etiqueta}:`, x, y)
  
  // Valor
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(0, 0, 0)
  const etiquetaWidth = pdf.getTextWidth(`${etiqueta}: `)
  const valorLines = pdf.splitTextToSize(valor, pageWidth - x - etiquetaWidth - 20)
  pdf.text(valorLines, x + etiquetaWidth, y)
  
  return y + (valorLines.length * 5)
}

export async function POST(request: NextRequest) {
  console.log("📥 [PDF] Solicitud recibida")
  
  try {
    // ========== VALIDACIÓN DEL REQUEST ==========
    if (!request.body) {
      console.error("❌ Body vacío")
      return NextResponse.json(
        { error: "Solicitud vacía" },
        { status: 400 }
      )
    }

    let body: { viajeId?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "JSON inválido" },
        { status: 400 }
      )
    }

    // Validar viajeId
    const { viajeId } = body
    if (!viajeId || typeof viajeId !== 'string' || viajeId.trim() === '') {
      return NextResponse.json(
        { error: "viajeId es requerido y debe ser un string válido" },
        { status: 400 }
      )
    }

    const trimmedViajeId = viajeId.trim()
    console.log("🔍 Buscando viaje:", trimmedViajeId)

    // ========== CONSULTA A LA BASE DE DATOS ==========
    let viajeData
    try {
      viajeData = await db
        .select()
        .from(viajes)
        .leftJoin(vehiculos, eq(viajes.vehiculoId, vehiculos.id))
        .leftJoin(conductores, eq(viajes.conductorId, conductores.id))
        .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
        .where(eq(viajes.id, trimmedViajeId))
    } catch (dbError) {
      console.error("❌ Error DB:", dbError)
      return NextResponse.json(
        { error: "Error al consultar la base de datos" },
        { status: 500 }
      )
    }

    if (!viajeData || viajeData.length === 0) {
      return NextResponse.json(
        { error: `Viaje con ID ${trimmedViajeId} no encontrado` },
        { status: 404 }
      )
    }

    const datos: ViajeCompleto = {
      viaje: viajeData[0].viajes,
      vehiculo: viajeData[0].vehiculos,
      conductor: viajeData[0].conductores,
      ruta: viajeData[0].rutas
    }

    // Validar datos mínimos necesarios
    if (!datos.viaje.numeroViaje) {
      return NextResponse.json(
        { error: "El viaje no tiene número asignado" },
        { status: 400 }
      )
    }

    console.log("✅ Viaje encontrado:", {
      numero: datos.viaje.numeroViaje,
      producto: datos.viaje.producto,
      tieneRuta: !!datos.ruta
    })

    // ========== GENERACIÓN DEL CÓDIGO QR ==========
    let qrDataUrl = ''
    let tipoMapa = 'ninguno'
    
    try {
      // Prioridad 1: Coordenadas de la ruta
      if (datos.ruta && 
          validarCoordenadas(
            datos.ruta.origenLat !== null ? Number(datos.ruta.origenLat) : null,
            datos.ruta.origenLng !== null ? Number(datos.ruta.origenLng) : null
          ) &&
          validarCoordenadas(
            datos.ruta.destinoLat !== null ? Number(datos.ruta.destinoLat) : null,
            datos.ruta.destinoLng !== null ? Number(datos.ruta.destinoLng) : null
          )) {
        
        const urlMapa = generarURLMapa(
          datos.ruta.origenLat !== null ? Number(datos.ruta.origenLat) : 0,
          datos.ruta.origenLng !== null ? Number(datos.ruta.origenLng) : 0,
          datos.ruta.destinoLat !== null ? Number(datos.ruta.destinoLat) : 0,
          datos.ruta.destinoLng !== null ? Number(datos.ruta.destinoLng) : 0
        )
        qrDataUrl = await QRCode.toDataURL(urlMapa, { width: 300, margin: 2 })
        tipoMapa = 'ruta'
        console.log("✅ QR generado con coordenadas de RUTA")
      }
      // Prioridad 2: Coordenadas del viaje
      else if (
        validarCoordenadas(
          datos.viaje.lugarCargaLat !== null ? Number(datos.viaje.lugarCargaLat) : null,
          datos.viaje.lugarCargaLng !== null ? Number(datos.viaje.lugarCargaLng) : null
        ) &&
        validarCoordenadas(
          datos.viaje.lugarDescargaLat !== null ? Number(datos.viaje.lugarDescargaLat) : null,
          datos.viaje.lugarDescargaLng !== null ? Number(datos.viaje.lugarDescargaLng) : null
        )
      ) {
        
        const urlMapa = generarURLMapa(
          datos.viaje.lugarCargaLat !== null ? Number(datos.viaje.lugarCargaLat) : 0,
          datos.viaje.lugarCargaLng !== null ? Number(datos.viaje.lugarCargaLng) : 0,
          datos.viaje.lugarDescargaLat !== null ? Number(datos.viaje.lugarDescargaLat) : 0,
          datos.viaje.lugarDescargaLng !== null ? Number(datos.viaje.lugarDescargaLng) : 0
        )
        qrDataUrl = await QRCode.toDataURL(urlMapa, { width: 300, margin: 2 })
        tipoMapa = 'viaje'
        console.log("✅ QR generado con coordenadas del VIAJE")
      }
      // Fallback: QR con información textual
      else {
        const infoTexto = [
          `Viaje N° ${datos.viaje.numeroViaje}`,
          `Producto: ${datos.viaje.producto || 'No especificado'}`,
          `Origen: ${datos.ruta?.origen || datos.viaje.lugarCarga || 'No especificado'}`,
          `Destino: ${datos.ruta?.destino || datos.viaje.lugarDescarga || 'No especificado'}`
        ].join('\n')
        
        qrDataUrl = await QRCode.toDataURL(infoTexto, { width: 300, margin: 2 })
        tipoMapa = 'texto'
        console.log("⚠️ QR generado con información textual (sin coordenadas)")
      }
    } catch (qrError) {
      console.error("❌ Error generando QR:", qrError)
      // QR de emergencia
      qrDataUrl = await QRCode.toDataURL(`Viaje: ${datos.viaje.numeroViaje}`, { width: 300, margin: 2 })
    }

    // ========== GENERACIÓN DEL PDF ==========
    console.log("📄 Generando PDF...")
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Header
    let yPos = dibujarHeader(pdf, datos.viaje.numeroViaje, pageWidth)
    yPos += 10

    // ========== INFORMACIÓN DE LA RUTA ==========
    if (datos.ruta) {
      yPos = dibujarSeccion(pdf, "📍 INFORMACIÓN DE LA RUTA", yPos, pageWidth, pageHeight)
      
      yPos = agregarCampo(pdf, "Nombre de Ruta", datos.ruta.nombre || "No especificado", 20, yPos, pageWidth, pageHeight)
      yPos = agregarCampo(pdf, "Origen", datos.ruta.origen || "No especificado", 20, yPos, pageWidth, pageHeight)
      yPos = agregarCampo(pdf, "Destino", datos.ruta.destino || "No especificado", 20, yPos, pageWidth, pageHeight)
      
      if (datos.ruta.distanciaKm) {
        yPos = agregarCampo(pdf, "Distancia", `${datos.ruta.distanciaKm} km`, 20, yPos, pageWidth, pageHeight)
      }
      
      if (datos.ruta.duracionMinutos) {
        const duracionMin = Number(datos.ruta.duracionMinutos)
        const horas = Math.floor(duracionMin / 60)
        const minutos = duracionMin % 60
        const duracionTexto = horas > 0 ? `${horas}h ${minutos}min` : `${minutos} min`
        yPos = agregarCampo(pdf, "Duración Estimada", duracionTexto, 20, yPos, pageWidth, pageHeight)
      }
      
      yPos += 5
    }

    // ========== INFORMACIÓN DEL VEHÍCULO ==========
    yPos = dibujarSeccion(pdf, "🚛 INFORMACIÓN DEL VEHÍCULO", yPos, pageWidth, pageHeight)
    
    yPos = agregarCampo(pdf, "Placa", datos.vehiculo?.placa || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Marca", datos.vehiculo?.marca || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Modelo", datos.vehiculo?.anio || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Tipo", datos.vehiculo?.tipoVehiculo || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Capacidad", datos.vehiculo?.capacidadLitros ? `${datos.vehiculo.capacidadLitros} litros` : "N/A", 20, yPos, pageWidth, pageHeight)
    yPos += 5

    // ========== INFORMACIÓN DEL CONDUCTOR ==========
    yPos = dibujarSeccion(pdf, "👤 INFORMACIÓN DEL CONDUCTOR", yPos, pageWidth, pageHeight)
    
    const nombreCompleto = datos.conductor 
      ? `${datos.conductor.nombre || ''} ${datos.conductor.apellido || ''}`.trim() || "No asignado"
      : "No asignado"
    
    yPos = agregarCampo(pdf, "Nombre Completo", nombreCompleto, 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Cédula de Identidad", datos.conductor?.ci || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Licencia", datos.conductor?.licencia || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Teléfono", datos.conductor?.telefono || "No asignado", 20, yPos, pageWidth, pageHeight)
    yPos += 5

    // ========== INFORMACIÓN DEL VIAJE ==========
    yPos = dibujarSeccion(pdf, "📦 DETALLES DEL VIAJE", yPos, pageWidth, pageHeight)
    
    yPos = agregarCampo(pdf, "Producto", datos.viaje.producto || "No especificado", 20, yPos, pageWidth, pageHeight)
    
    const cantidadTexto = datos.viaje.cantidad 
      ? `${datos.viaje.cantidad} ${datos.viaje.unidad || ''}`.trim()
      : "No especificada"
    yPos = agregarCampo(pdf, "Cantidad", cantidadTexto, 20, yPos, pageWidth, pageHeight)
    
    const lugarCarga = datos.ruta?.origen || datos.viaje.lugarCarga || "No especificado"
    const lugarDescarga = datos.ruta?.destino || datos.viaje.lugarDescarga || "No especificado"
    
    yPos = agregarCampo(pdf, "Lugar de Carga", lugarCarga, 20, yPos, pageWidth, pageHeight)
    yPos = agregarCampo(pdf, "Lugar de Descarga", lugarDescarga, 20, yPos, pageWidth, pageHeight)
    
    if (datos.viaje.fechaInicio) {
      yPos = agregarCampo(pdf, "Fecha de Inicio", formatearFecha(datos.viaje.fechaInicio), 20, yPos, pageWidth, pageHeight)
    }
    
    if (datos.viaje.fechaEstimadaLlegada) {
      yPos = agregarCampo(pdf, "Fecha Estimada de Llegada", formatearFecha(datos.viaje.fechaEstimadaLlegada), 20, yPos, pageWidth, pageHeight)
    }
    
    yPos += 10

    // ========== CÓDIGO QR ==========
    if (yPos + 70 > pageHeight - 20) {
      pdf.addPage()
      yPos = 20
    }

    yPos = dibujarSeccion(pdf, "🗺️ CÓDIGO QR - RUTA DEL VIAJE", yPos, pageWidth, pageHeight)
    
    // Mensaje según tipo de QR
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100, 100, 100)
    
    let mensajeQR = ''
    if (tipoMapa === 'ruta') {
      mensajeQR = 'Escanea para abrir la ruta en Google Maps (coordenadas de ruta registrada)'
    } else if (tipoMapa === 'viaje') {
      mensajeQR = 'Escanea para abrir la ruta en Google Maps (coordenadas del viaje)'
    } else {
      mensajeQR = 'Código QR con información del viaje (sin coordenadas GPS disponibles)'
    }
    
    const mensajeLines = pdf.splitTextToSize(mensajeQR, pageWidth - 40)
    pdf.text(mensajeLines, 20, yPos)
    yPos += mensajeLines.length * 4 + 5
    
    // Agregar QR centrado
    try {
      const qrSize = 55
      const qrX = (pageWidth - qrSize) / 2
      pdf.addImage(qrDataUrl, "PNG", qrX, yPos, qrSize, qrSize)
      yPos += qrSize + 10
    } catch (imageError) {
      console.error("❌ Error agregando imagen QR:", imageError)
      pdf.setTextColor(255, 0, 0)
      pdf.text("Error al generar código QR", pageWidth / 2, yPos, { align: "center" })
      yPos += 10
    }

    // ========== OBSERVACIONES ==========
    if (datos.viaje.observaciones && datos.viaje.observaciones.trim()) {
      if (yPos + 25 > pageHeight - 20) {
        pdf.addPage()
        yPos = 20
      }
      
      yPos = dibujarSeccion(pdf, "📝 OBSERVACIONES", yPos, pageWidth, pageHeight)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      
      const obsLines = pdf.splitTextToSize(datos.viaje.observaciones, pageWidth - 40)
      pdf.text(obsLines, 20, yPos)
      yPos += obsLines.length * 4 + 10
    }

    // ========== FOOTER ==========
    const totalPages = pdf.getNumberOfPages()
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      const footerY = pageHeight - 10
      pdf.text(
        `Página ${i} de ${totalPages} | Generado: ${new Date().toLocaleString('es-BO')}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      )
    }

    // ========== GENERAR Y ENVIAR PDF ==========
    console.log("💾 Convirtiendo PDF a buffer...")
    const pdfBuffer = pdf.output('arraybuffer')
    const filename = `Hoja-Ruta-${datos.viaje.numeroViaje.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`

    console.log("✅ PDF generado:", {
      tamaño: `${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`,
      páginas: totalPages,
      tipoQR: tipoMapa
    })

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })

  } catch (error) {
    console.error("💥 Error crítico:", error)
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor al generar PDF",
        details: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}