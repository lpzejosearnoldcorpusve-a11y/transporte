import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import type { UploadApiResponse } from "cloudinary"

export const runtime = "nodejs"

// Configuración
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const UPLOAD_FOLDER = "usuarios"

// Tipos de error personalizados
class UploadError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = "UploadError"
  }
}

// Validar archivo
function validateFile(file: File): void {
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError(
      `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      413
    )
  }

  // Validar tipo MIME
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError(
      `Tipo de archivo no permitido. Formatos aceptados: ${ALLOWED_TYPES.join(", ")}`,
      415
    )
  }

  // Validar nombre del archivo
  if (!file.name || file.name.length > 255) {
    throw new UploadError("Nombre de archivo inválido")
  }
}

// Generar nombre único para el archivo
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split(".").pop()
  return `${timestamp}-${randomString}.${extension}`
}

// Subir a Cloudinary con reintentos
async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  retries = 3
): Promise<UploadApiResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: UPLOAD_FOLDER,
            resource_type: "image",
            public_id: filename.split(".")[0], // Sin extensión
            overwrite: false,
            transformation: [
              { width: 1000, height: 1000, crop: "limit" }, // Máximo 1000x1000
              { quality: "auto:good" }, // Optimización automática
              { fetch_format: "auto" }, // WebP si el navegador lo soporta
            ],
            tags: ["profile", "user-upload"], // Tags para organización
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result!)
            }
          }
        )
        uploadStream.end(buffer)
      })
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      // Esperar antes de reintentar (backoff exponencial)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
  throw new Error("No se pudo subir después de varios intentos")
}

export async function POST(req: NextRequest) {
  try {
    // Obtener el archivo del FormData
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      throw new UploadError("No se proporcionó ningún archivo")
    }

    // Validar el archivo
    validateFile(file)

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generar nombre único
    const uniqueFilename = generateUniqueFilename(file.name)

    // Subir a Cloudinary
    const result = await uploadToCloudinary(buffer, uniqueFilename)

    // Log de éxito (opcional, útil para debugging)
    console.log(`✅ Imagen subida exitosamente: ${result.public_id}`)

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
      { status: 201 }
    )
  } catch (error) {
    // Manejo de errores específicos
    if (error instanceof UploadError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      )
    }

    // Error de Cloudinary
    if (error && typeof error === "object" && "http_code" in error) {
      console.error("❌ Error de Cloudinary:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Error al procesar la imagen en el servidor",
        },
        { status: 500 }
      )
    }

    // Error genérico
    console.error("❌ Error inesperado al subir imagen:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}

// Opcional: Endpoint DELETE para eliminar imágenes
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get("public_id")

    if (!publicId) {
      throw new UploadError("Se requiere el public_id de la imagen")
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId)

    console.log(`🗑️  Imagen eliminada: ${publicId}`)

    return NextResponse.json(
      {
        success: true,
        message: "Imagen eliminada correctamente",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error al eliminar imagen:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la imagen",
      },
      { status: 500 }
    )
  }
}