import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { tipos, incluirEstadisticas } = await req.json()

    if (!Array.isArray(tipos) || tipos.length === 0) {
      return Response.json({ error: "Se requiere al menos un tipo de reporte" }, { status: 400 })
    }

    if (tipos.length > 10) {
      return Response.json({ error: "Máximo 10 reportes por solicitud" }, { status: 400 })
    }

    // Generar todos los reportes
    const reportes = await Promise.all(
      tipos.map(async (tipo) => {
        try {
          // Fetch data for each report type
          const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reportes/${tipo}`)
          
          if (!response.ok) {
            throw new Error(`Error al obtener datos de ${tipo}`)
          }

          const data = await response.json()
          
          // Generate PDF for this report type
          const pdfResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reportes/generar-pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo, reportes: data.reportes }),
          })

          if (!pdfResponse.ok) {
            throw new Error(`Error al generar PDF de ${tipo}`)
          }

          const pdfBuffer = await pdfResponse.arrayBuffer()
          
          return {
            tipo,
            success: true,
            filename: `reporte-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`,
            data: Buffer.from(pdfBuffer).toString('base64'),
            size: pdfBuffer.byteLength,
          }
        } catch (error) {
          console.error(`Error generating ${tipo} report:`, error)
          return {
            tipo,
            success: false,
            error: error instanceof Error ? error.message : "Error desconocido",
          }
        }
      })
    )

    // Generar reporte consolidado si se solicita
    let reporteConsolidado = null
    if (incluirEstadisticas) {
      try {
        // Aquí puedes crear un reporte consolidado con estadísticas generales
        const exitosos = reportes.filter(r => r.success)
        const fallidos = reportes.filter(r => !r.success)
        
        reporteConsolidado = {
          fecha: new Date().toISOString(),
          totalSolicitados: tipos.length,
          exitosos: exitosos.length,
          fallidos: fallidos.length,
          tiposExitosos: exitosos.map(r => r.tipo),
          tiposFallidos: fallidos.map(r => r.tipo),
          tamaноTotal: exitosos.reduce((sum, r) => sum + (r.size || 0), 0),
        }
      } catch (error) {
        console.error("Error generating consolidated report:", error)
      }
    }

    return Response.json({
      success: true,
      reportes,
      consolidado: reporteConsolidado,
      mensaje: `${reportes.filter(r => r.success).length} de ${reportes.length} reportes generados exitosamente`
    })

  } catch (error) {
    console.error("Error in bulk report generation:", error)
    return Response.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    )
  }
}