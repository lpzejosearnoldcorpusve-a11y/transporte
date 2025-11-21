import { jsPDF } from "jspdf"
import type { ReporteConductor, ReporteRuta, ReporteGPS, ReporteVehiculo } from "@/types/reportes"

interface PDFHeader {
  tipo: string
  fecha: string
  totalRegistros: number
}

class PDFGenerator {
  private doc: jsPDF
  private pageHeight = 297
  private marginLeft = 10
  private marginTop = 15
  private currentY = 40

  constructor() {
    this.doc = new jsPDF()
  }

  private addHeader(header: PDFHeader) {
    // Logo y título
    this.doc.setFont("Helvetica", "bold")
    this.doc.setFontSize(18)
    this.doc.setTextColor(22, 88, 12)
    this.doc.text(`Reporte de ${header.tipo.charAt(0).toUpperCase() + header.tipo.slice(1)}`, this.marginLeft, this.marginTop)
    
    // Línea decorativa
    this.doc.setDrawColor(22, 88, 12)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.marginLeft, 20, 200, 20)
    
    // Información del reporte
    this.doc.setFont("Helvetica", "normal")
    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`Fecha de generación: ${header.fecha}`, this.marginLeft, 27)
    this.doc.text(`Total de registros: ${header.totalRegistros}`, this.marginLeft, 32)
    this.doc.text(`Sistema de Gestión de Transporte`, 120, 27)
    this.doc.text(`Transpore App`, 120, 32)
    
    this.currentY = 40
  }

  private checkPageBreak(requiredHeight: number = 10): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - 20) {
      this.doc.addPage()
      this.currentY = 20
      return true
    }
    return false
  }

  private addTableHeader(headers: string[], widths: number[]) {
    this.checkPageBreak(15)
    
    this.doc.setFont("Helvetica", "bold")
    this.doc.setFontSize(9)
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFillColor(22, 88, 12)
    
    let x = this.marginLeft
    headers.forEach((header, index) => {
      this.doc.rect(x, this.currentY, widths[index], 8, "F")
      this.doc.text(header, x + 2, this.currentY + 5.5)
      x += widths[index]
    })
    
    this.currentY += 10
  }

  private addTableRow(data: string[], widths: number[], isEven: boolean = false) {
    this.checkPageBreak()
    
    this.doc.setFont("Helvetica", "normal")
    this.doc.setFontSize(8)
    this.doc.setTextColor(0, 0, 0)
    
    if (isEven) {
      this.doc.setFillColor(248, 249, 250)
      this.doc.rect(this.marginLeft, this.currentY, widths.reduce((a, b) => a + b, 0), 7, "F")
    }
    
    let x = this.marginLeft
    data.forEach((text, index) => {
      const maxWidth = widths[index] - 4
      const splitText = this.doc.splitTextToSize(text, maxWidth)
      this.doc.text(splitText[0] || "", x + 2, this.currentY + 5)
      x += widths[index]
    })
    
    this.currentY += 7
  }

  generateConductoresReport(reportes: ReporteConductor[]): jsPDF {
    this.addHeader({
      tipo: "conductores",
      fecha: new Date().toLocaleDateString("es-ES"),
      totalRegistros: reportes.length
    })

    const headers = ["Nombre", "CI", "Licencia", "Estado", "Teléfono", "Vencimiento"]
    const widths = [35, 25, 25, 20, 25, 30]
    
    this.addTableHeader(headers, widths)
    
    reportes.forEach((conductor, index) => {
      const rowData = [
        `${conductor.nombre} ${conductor.apellido}`,
        conductor.ci,
        conductor.licencia,
        conductor.estado,
        conductor.telefono,
        `${conductor.diasParaVencer} días`
      ]
      this.addTableRow(rowData, widths, index % 2 === 0)
    })

    return this.doc
  }

  generateRutasReport(reportes: ReporteRuta[]): jsPDF {
    this.addHeader({
      tipo: "rutas",
      fecha: new Date().toLocaleDateString("es-ES"),
      totalRegistros: reportes.length
    })

    const headers = ["Ruta", "Origen", "Destino", "Estado", "Distancia", "Duración", "Vehículo"]
    const widths = [25, 30, 30, 20, 18, 18, 25]
    
    this.addTableHeader(headers, widths)
    
    reportes.forEach((ruta, index) => {
      const rowData = [
        ruta.nombre,
        ruta.origen,
        ruta.destino,
        ruta.estado,
        `${ruta.distanciaKm} km`,
        `${Math.floor(ruta.duracionMinutos / 60)}h ${ruta.duracionMinutos % 60}m`,
        ruta.vehiculoPlaca
      ]
      this.addTableRow(rowData, widths, index % 2 === 0)
    })

    return this.doc
  }

  generateGPSReport(reportes: ReporteGPS[]): jsPDF {
    this.addHeader({
      tipo: "gps",
      fecha: new Date().toLocaleDateString("es-ES"),
      totalRegistros: reportes.length
    })

    const headers = ["IMEI", "Vehículo", "Estado", "Vel. Promedio", "Vel. Máxima", "Alertas"]
    const widths = [30, 25, 20, 25, 25, 40]
    
    this.addTableHeader(headers, widths)
    
    reportes.forEach((gps, index) => {
      const alertasTexto = Object.entries(gps.alertas)
        .filter(([_, value]) => value)
        .map(([key]) => {
          switch (key) {
            case 'excesoVelocidad': return 'Exceso vel.'
            case 'combustibleBajo': return 'Combustible bajo'
            case 'gpsDesconectado': return 'Desconectado'
            case 'fueraDeRuta': return 'Fuera de ruta'
            default: return key
          }
        })
        .join(', ') || 'Sin alertas'
      
      const rowData = [
        gps.imei,
        gps.vehiculo_placa,
        gps.alertas.gpsDesconectado ? "Desconectado" : "Conectado",
        `${gps.velocidadPromedio} km/h`,
        `${gps.velocidadMaxima} km/h`,
        alertasTexto
      ]
      this.addTableRow(rowData, widths, index % 2 === 0)
    })

    return this.doc
  }

  generateVehiculosReport(reportes: ReporteVehiculo[]): jsPDF {
    this.addHeader({
      tipo: "vehiculos",
      fecha: new Date().toLocaleDateString("es-ES"),
      totalRegistros: reportes.length
    })

    const headers = ["Placa", "Marca", "Tipo", "Estado", "GPS", "SOAT", "ITV", "Viajes/Mes"]
    const widths = [20, 25, 20, 18, 15, 22, 22, 18]
    
    this.addTableHeader(headers, widths)
    
    reportes.forEach((vehiculo, index) => {
      const formatFecha = (fecha: string) => {
        if (fecha === "N/A") return "N/A"
        return new Date(fecha).toLocaleDateString("es-ES")
      }
      
      const rowData = [
        vehiculo.placa,
        vehiculo.marca,
        vehiculo.tipoVehiculo,
        vehiculo.estado,
        vehiculo.gpsActivo ? "Activo" : "Inactivo",
        formatFecha(vehiculo.soatVencimiento),
        formatFecha(vehiculo.itvVencimiento),
        vehiculo.viajesMes.toString()
      ]
      this.addTableRow(rowData, widths, index % 2 === 0)
    })

    return this.doc
  }
}

export async function POST(req: Request) {
  try {
    const { tipo, reportes } = await req.json()

    const generator = new PDFGenerator()
    let doc: jsPDF

    switch (tipo) {
      case "conductores":
        doc = generator.generateConductoresReport(reportes as ReporteConductor[])
        break
      case "rutas":
        doc = generator.generateRutasReport(reportes as ReporteRuta[])
        break
      case "gps":
        doc = generator.generateGPSReport(reportes as ReporteGPS[])
        break
      case "vehiculos":
        doc = generator.generateVehiculosReport(reportes as ReporteVehiculo[])
        break
      default:
        return Response.json({ error: "Tipo de reporte no válido" }, { status: 400 })
    }

    const buffer = doc.output("arraybuffer")
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte-${tipo}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Error al generar PDF" }, { status: 500 })
  }
}
