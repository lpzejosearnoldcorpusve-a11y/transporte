import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { documentosConductor } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conductorId = searchParams.get("conductorId")

    let query = db.select().from(documentosConductor)

    if (conductorId) {
      query = query.where(eq(documentosConductor.conductorId, conductorId)) as any
    }

    const documentos = await query.orderBy(desc(documentosConductor.creadoEn))

    return NextResponse.json(documentos)
  } catch (error) {
    console.error("Error fetching documentos:", error)
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const archivo = formData.get("archivo") as File
    const conductorId = formData.get("conductorId") as string
    const tipoDocumento = formData.get("tipoDocumento") as string
    const descripcion = formData.get("descripcion") as string | null
    const fechaEmision = formData.get("fechaEmision") as string | null
    const fechaVencimiento = formData.get("fechaVencimiento") as string | null
    const subidoPor = formData.get("subidoPor") as string | null

    if (!archivo || !conductorId || !tipoDocumento) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }
    let resourceType: "image" | "raw" | "video" | "auto" = "auto"
    
    if (archivo.type === "application/pdf") {
      resourceType = "raw" 
    } else if (archivo.type.startsWith("image/")) {
      resourceType = "image"
    } else if (archivo.type.startsWith("video/")) {
      resourceType = "video"
    } else {
      resourceType = "raw" // Para otros tipos de archivo (docs, excel, etc)
    }
    const cloudinaryResult = await uploadToCloudinary(
      archivo, 
      `conductores/${conductorId}`, 
      resourceType
    )


    const [nuevoDocumento] = await db
      .insert(documentosConductor)
      .values({
        conductorId,
        tipoDocumento,
        nombreArchivo: archivo.name,
        urlArchivo: cloudinaryResult.secure_url, 
        tipoArchivo: archivo.type,
        tamanoBytes: cloudinaryResult.bytes.toString(),
        descripcion,
        fechaEmision: fechaEmision ? new Date(fechaEmision) : null,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
        subidoPor,
      })
      .returning()

    return NextResponse.json(nuevoDocumento, { status: 201 })
  } catch (error) {
    console.error("Error creating documento:", error)
    return NextResponse.json({ error: "Error al crear documento" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, fechaEmision, fechaVencimiento, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }
    const datosParaActualizar: any = {
      actualizadoEn: new Date(),
    }
    const camposPermitidos = ['tipoDocumento', 'descripcion', 'subidoPor']
    
    camposPermitidos.forEach(campo => {
      if (campo in updateData) {
        datosParaActualizar[campo] = updateData[campo]
      }
    })
    if (fechaEmision !== undefined) {
      if (fechaEmision === null || fechaEmision === '' || fechaEmision === 'null') {
        datosParaActualizar.fechaEmision = null
      } else {
        try {
          const fecha = new Date(fechaEmision)
          if (!isNaN(fecha.getTime())) {
            datosParaActualizar.fechaEmision = fecha
          } else {
            console.error('Fecha de emisión inválida:', fechaEmision)
          }
        } catch (err) {
          console.error('Error parseando fechaEmision:', err)
        }
      }
    }

    if (fechaVencimiento !== undefined) {
      if (fechaVencimiento === null || fechaVencimiento === '' || fechaVencimiento === 'null') {
        datosParaActualizar.fechaVencimiento = null
      } else {
        try {
          const fecha = new Date(fechaVencimiento)
          if (!isNaN(fecha.getTime())) {
            datosParaActualizar.fechaVencimiento = fecha
          } else {
            console.error('Fecha de vencimiento inválida:', fechaVencimiento)
          }
        } catch (err) {
          console.error('Error parseando fechaVencimiento:', err)
        }
      }
    }

    console.log('Datos a actualizar:', datosParaActualizar)

    const [documentoActualizado] = await db
      .update(documentosConductor)
      .set(datosParaActualizar)
      .where(eq(documentosConductor.id, id))
      .returning()

    if (!documentoActualizado) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(documentoActualizado)
  } catch (error) {
    console.error("Error updating documento:", error)
    
    // Mejor logging del error
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    const errorStack = error instanceof Error ? error.stack : ""
    
    console.error('Detalles del error:', {
      message: errorMessage,
      stack: errorStack,
      body: await request.clone().json().catch(() => ({}))
    })
    
    return NextResponse.json({ 
      error: "Error al actualizar documento",
      details: errorMessage,
      hint: "Revisa los logs del servidor para más información"
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    // Obtener el documento antes de eliminarlo
    const [documento] = await db
      .select()
      .from(documentosConductor)
      .where(eq(documentosConductor.id, id))

    if (!documento) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    // Extraer public_id de la URL de Cloudinary
    // Ejemplo de URL: https://res.cloudinary.com/xxx/image/upload/v123/conductores/abc/file.pdf
    const urlParts = documento.urlArchivo.split("/")
    const uploadIndex = urlParts.indexOf("upload")
    
    if (uploadIndex === -1) {
      console.error("URL de Cloudinary inválida:", documento.urlArchivo)
    } else {
      // Obtener todo después de "upload" (puede incluir versión)
      const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/")
      // Remover la extensión del archivo
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "")
      
      // Determinar el resource_type para eliminación
      let resourceType: "image" | "raw" | "video" = "raw"
      if (documento.tipoArchivo === "application/pdf") {
        resourceType = "raw" // PDFs se guardan como "raw" en Cloudinary
      } else if (documento.tipoArchivo.startsWith("image/")) {
        resourceType = "image"
      } else if (documento.tipoArchivo.startsWith("video/")) {
        resourceType = "video"
      }

      // Eliminar de Cloudinary
      try {
        await deleteFromCloudinary(publicId, resourceType)
        console.log(`Archivo eliminado de Cloudinary: ${publicId}`)
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error)
      }
    }

    await db.delete(documentosConductor).where(eq(documentosConductor.id, id))

    return NextResponse.json({ 
      message: "Documento eliminado correctamente",
      id: documento.id 
    })
  } catch (error) {
    console.error("Error deleting documento:", error)
    return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 })
  }
}