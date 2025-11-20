import { db } from "@/db/index"
import { viajes, vehiculos, conductores, rutas } from "@/db/schema" // 👈 Agrega rutas
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import jsPDF from "jspdf"
import QRCode from "qrcode"

export async function POST(request: NextRequest) {
  console.log("📥 [PDF] Solicitud recibida para generar PDF")
  
  try {
    // Verificar que el body existe
    if (!request.body) {
      console.error("❌ [PDF] Request body está vacío")
      return NextResponse.json(
        { error: "Solicitud vacía" },
        { status: 400 }
      )
    }

    let body;
    try {
      body = await request.json()
      console.log("📦 [PDF] Body recibido:", body)
    } catch (jsonError) {
      console.error("❌ [PDF] Error parseando JSON:", jsonError)
      return NextResponse.json(
        { error: "JSON inválido" },
        { status: 400 }
      )
    }

    const { viajeId } = body

    // Validar viajeId
    if (!viajeId) {
      console.error("❌ [PDF] viajeId no proporcionado")
      return NextResponse.json(
        { error: "viajeId es requerido" },
        { status: 400 }
      )
    }

    if (typeof viajeId !== 'string' || viajeId.trim() === '') {
      console.error("❌ [PDF] viajeId inválido:", viajeId)
      return NextResponse.json(
        { error: "viajeId debe ser un string válido" },
        { status: 400 }
      )
    }

    const trimmedViajeId = viajeId.trim()
    console.log("🔍 [PDF] Buscando viaje:", trimmedViajeId)

    // Buscar datos del viaje INCLUYENDO la ruta
    let viajeData;
    try {
      viajeData = await db
        .select()
        .from(viajes)
        .leftJoin(vehiculos, eq(viajes.vehiculoId, vehiculos.id))
        .leftJoin(conductores, eq(viajes.conductorId, conductores.id))
        .leftJoin(rutas, eq(viajes.rutaId, rutas.id)) // 👈 NUEVO JOIN con rutas
        .where(eq(viajes.id, trimmedViajeId))

      console.log("📊 [PDF] Datos del viaje encontrados:", viajeData.length)
    } catch (dbError) {
      console.error("❌ [PDF] Error en consulta DB:", dbError)
      return NextResponse.json(
        { error: "Error al buscar datos del viaje" },
        { status: 500 }
      )
    }

    if (!viajeData || viajeData.length === 0) {
      console.error("❌ [PDF] Viaje no encontrado para ID:", trimmedViajeId)
      return NextResponse.json(
        { error: "Viaje no encontrado" },
        { status: 404 }
      )
    }

    const viaje = viajeData[0].viajes
    const vehiculo = viajeData[0].vehiculos
    const conductor = viajeData[0].conductores
    const ruta = viajeData[0].rutas // 👈 Obtén los datos de la ruta

    console.log("✅ [PDF] Viaje encontrado:", {
      numeroViaje: viaje.numeroViaje,
      producto: viaje.producto,
      vehiculo: vehiculo?.placa || 'No asignado',
      conductor: conductor?.nombre || 'No asignado',
      tieneRuta: !!ruta,
      rutaNombre: ruta?.nombre || 'Sin ruta'
    })

    // Validar datos mínimos requeridos para el PDF
    if (!viaje.numeroViaje) {
      console.error("❌ [PDF] Viaje sin número de viaje")
      return NextResponse.json(
        { error: "El viaje no tiene número asignado" },
        { status: 400 }
      )
    }

    // Generar QR - PRIORIDAD: usar coordenadas de la RUTA
    let qrDataUrl = '';
    try {
      // PRIMERO intentar con coordenadas de la RUTA
      if (ruta?.origenLat && ruta?.origenLng && ruta?.destinoLat && ruta?.destinoLng) {
        const qrContent = `https://www.openstreetmap.org/?zoom=12&lat=${ruta.origenLat}&lon=${ruta.origenLng}&layers=N&route=${ruta.origenLat},${ruta.origenLng}|${ruta.destinoLat},${ruta.destinoLng}`
        console.log("🎨 [PDF] Generando QR con coordenadas de la RUTA:", {
          origen: `${ruta.origenLat}, ${ruta.origenLng}`,
          destino: `${ruta.destinoLat}, ${ruta.destinoLng}`
        })
        qrDataUrl = await QRCode.toDataURL(qrContent)
      } 
      // SEGUNDO intentar con coordenadas del VIAJE
      else if (viaje.lugarCargaLat && viaje.lugarCargaLng && viaje.lugarDescargaLat && viaje.lugarDescargaLng) {
        const qrContent = `https://www.openstreetmap.org/?zoom=12&lat=${viaje.lugarCargaLat}&lon=${viaje.lugarCargaLng}&layers=N&route=${viaje.lugarCargaLat},${viaje.lugarCargaLng}|${viaje.lugarDescargaLat},${viaje.lugarDescargaLng}`
        console.log("🎨 [PDF] Generando QR con coordenadas del VIAJE")
        qrDataUrl = await QRCode.toDataURL(qrContent)
      } 
      // TERCERO: QR alternativo con información básica
      else {
        console.log("⚠️ [PDF] Sin coordenadas, generando QR alternativo")
        qrDataUrl = await QRCode.toDataURL(`Viaje: ${viaje.numeroViaje} - ${viaje.producto}\nOrigen: ${viaje.lugarCarga}\nDestino: ${viaje.lugarDescarga}`)
      }
    } catch (qrError) {
      console.error("❌ [PDF] Error generando QR:", qrError)
      // Generar QR alternativo
      qrDataUrl = await QRCode.toDataURL(`Viaje: ${viaje.numeroViaje}`)
    }

    // Crear PDF
    console.log("📄 [PDF] Creando PDF...")
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Configuración de fuentes y colores
    const primaryColor = [20, 70, 50]
    const secondaryColor = [0, 0, 0]

    // Encabezado
    pdf.setFontSize(24)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text("HOJA DE RUTA", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Número de viaje
    pdf.setFontSize(11)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`Viaje: ${viaje.numeroViaje}`, 20, yPosition)
    yPosition += 8

    // Información de la RUTA (si existe)
    if (ruta) {
      pdf.setFontSize(12)
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.text("INFORMACIÓN DE LA RUTA", 20, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      pdf.text(`Nombre: ${ruta.nombre || "No especificado"}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Origen: ${ruta.origen || viaje.lugarCarga}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Destino: ${ruta.destino || viaje.lugarDescarga}`, 20, yPosition)
      yPosition += 6
      if (ruta.distanciaKm) {
        pdf.text(`Distancia: ${ruta.distanciaKm} km`, 20, yPosition)
        yPosition += 6
      }
      if (ruta.duracionMinutos) {
        pdf.text(`Duración estimada: ${ruta.duracionMinutos} min`, 20, yPosition)
        yPosition += 6
      }
      yPosition += 6
    }

    // Información del vehículo
    pdf.setFontSize(12)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text("INFORMACIÓN DEL VEHÍCULO", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`Placa: ${vehiculo?.placa || "No asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Marca: ${vehiculo?.marca || "No asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Tipo: ${vehiculo?.tipoVehiculo || "No asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Capacidad: ${vehiculo?.capacidadLitros || "N/A"} litros`, 20, yPosition)
    yPosition += 12

    // Información del conductor
    pdf.setFontSize(12)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text("INFORMACIÓN DEL CONDUCTOR", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`Nombre: ${conductor?.nombre || "No"} ${conductor?.apellido || "asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Cédula: ${conductor?.ci || "No asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Licencia: ${conductor?.licencia || "No asignado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Teléfono: ${conductor?.telefono || "No asignado"}`, 20, yPosition)
    yPosition += 12

    // Información del viaje
    pdf.setFontSize(12)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text("INFORMACIÓN DEL VIAJE", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`Producto: ${viaje.producto || "No especificado"}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Cantidad: ${viaje.cantidad || "N/A"} ${viaje.unidad || ""}`, 20, yPosition)
    yPosition += 6
    
    // Mostrar lugares de carga/descarga (usar los de la ruta si existen)
    const lugarCarga = ruta?.origen || viaje.lugarCarga || "No especificado"
    const lugarDescarga = ruta?.destino || viaje.lugarDescarga || "No especificado"
    
    pdf.text(`Lugar de Carga: ${lugarCarga}`, 20, yPosition)
    yPosition += 6
    pdf.text(`Lugar de Descarga: ${lugarDescarga}`, 20, yPosition)
    yPosition += 6
    
    // Fechas
    if (viaje.fechaInicio) {
      try {
        const fechaInicio = new Date(viaje.fechaInicio).toLocaleString("es-ES")
        pdf.text(`Fecha de Inicio: ${fechaInicio}`, 20, yPosition)
        yPosition += 6
      } catch (dateError) {
        pdf.text(`Fecha de Inicio: ${viaje.fechaInicio}`, 20, yPosition)
        yPosition += 6
      }
    }
    
    if (viaje.fechaEstimadaLlegada) {
      try {
        const fechaEstimada = new Date(viaje.fechaEstimadaLlegada).toLocaleString("es-ES")
        pdf.text(`Fecha Estimada de Llegada: ${fechaEstimada}`, 20, yPosition)
        yPosition += 6
      } catch (dateError) {
        pdf.text(`Fecha Estimada de Llegada: ${viaje.fechaEstimadaLlegada}`, 20, yPosition)
        yPosition += 6
      }
    }
    
    yPosition += 6

    // Agregar QR
    if (yPosition + 60 > pageHeight) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(12)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text("CÓDIGO QR - Escanea para ver la ruta", 20, yPosition)
    yPosition += 8
    
    try {
      pdf.addImage(qrDataUrl, "PNG", pageWidth / 2 - 25, yPosition, 50, 50)
      yPosition += 55
    } catch (imageError) {
      console.error("❌ [PDF] Error agregando imagen QR:", imageError)
      pdf.text("(Error al generar código QR)", pageWidth / 2, yPosition + 25, { align: "center" })
      yPosition += 55
    }

    // Observaciones
    if (viaje.observaciones) {
      if (yPosition + 20 > pageHeight) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.setFontSize(10)
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.text("OBSERVACIONES:", 20, yPosition)
      yPosition += 6
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      
      try {
        const observacionesLines = pdf.splitTextToSize(viaje.observaciones, pageWidth - 40)
        pdf.text(observacionesLines, 20, yPosition)
      } catch (textError) {
        pdf.text("(Error al procesar observaciones)", 20, yPosition)
      }
    }

    // Generar el PDF
    console.log("💾 [PDF] Convirtiendo PDF a buffer...")
    const pdfUint8Array = pdf.output('arraybuffer')
    const filename = `Hoja-Ruta-${viaje.numeroViaje}.pdf`

    console.log("✅ [PDF] PDF generado exitosamente, tamaño:", pdfUint8Array.byteLength, "bytes")

    return new NextResponse(pdfUint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    })

  } catch (error) {
    console.error("💥 [PDF] Error crítico generando PDF:", error)
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor al generar PDF",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    )
  }
}