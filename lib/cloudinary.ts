import { v2 as cloudinary } from "cloudinary"

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  bytes: number
  created_at: string
}

/**
 * Sube un archivo a Cloudinary
 * @param file - Archivo a subir (File o Buffer)
 * @param folder - Carpeta en Cloudinary donde se guardará
 * @param resourceType - Tipo de recurso (image, video, raw, auto)
 * @returns Resultado de la subida con URL y metadata
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  folder = "documentos-conductor",
  resourceType: "image" | "video" | "raw" | "auto" = "auto",
): Promise<CloudinaryUploadResult> {
  try {
    let buffer: Buffer
    let fileName = ""
    
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      fileName = file.name
    } else {
      buffer = file
    }
    const base64 = buffer.toString("base64")
    const dataURI = `data:application/octet-stream;base64,${base64}`
    const isPdf = fileName.toLowerCase().endsWith('.pdf') || resourceType === 'image'
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      // CRÍTICO: Configuración para acceso público
      access_mode: "public", // ← Hace el archivo públicamente accesible
      type: "upload", // ← Tipo de upload público (no authenticated)
      // Configuración específica para PDFs
      ...(isPdf && {
        format: "pdf",
        flags: "attachment", // Permite descarga directa del PDF
      }),
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      created_at: result.created_at,
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Error al subir archivo a Cloudinary")
  }
}

/**
 * Elimina un archivo de Cloudinary
 * @param publicId - ID público del archivo en Cloudinary
 * @param resourceType - Tipo de recurso
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { 
      resource_type: resourceType,
      type: "upload", // Debe coincidir con el tipo usado al subir
    })
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw new Error("Error al eliminar archivo de Cloudinary")
  }
}

/**
 * Obtiene la URL optimizada de un archivo
 * @param publicId - ID público del archivo
 * @param transformations - Transformaciones a aplicar
 */
export function getOptimizedUrl(publicId: string, transformations?: Record<string, any>): string {
  return cloudinary.url(publicId, {
    secure: true,
    type: "upload", // Asegurar que use el tipo correcto
    ...transformations,
  })
}

/**
 * Genera una URL de thumbnail para imágenes
 * @param publicId - ID público de la imagen
 * @param width - Ancho del thumbnail
 * @param height - Alto del thumbnail
 */
export function getThumbnailUrl(publicId: string, width = 200, height = 200): string {
  return cloudinary.url(publicId, {
    secure: true,
    type: "upload",
    transformation: [{ width, height, crop: "fill", quality: "auto", fetch_format: "auto" }],
  })
}

/**
 * Genera URL de preview de PDF (primera página como imagen)
 * @param publicId - ID público del PDF
 * @param page - Número de página (por defecto 1)
 * @param width - Ancho de la imagen (por defecto 1000)
 */
export function getPdfPreviewUrl(publicId: string, page = 1, width = 1000): string {
  return cloudinary.url(publicId, {
    secure: true,
    type: "upload",
    resource_type: "image",
    transformation: [
      { page: page, format: "jpg", quality: "auto", width: width }
    ],
  })
}

/**
 * Extrae el public_id de una URL de Cloudinary
 * @param url - URL completa de Cloudinary
 * @returns public_id del archivo
 */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
  return match ? match[1] : null
}

export { cloudinary }