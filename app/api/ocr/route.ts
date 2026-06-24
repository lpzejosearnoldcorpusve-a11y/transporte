import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL de imagen es requerida" }, { status: 400 })
    }

    // Ruta al script de python
    const scriptPath = path.join(process.cwd(), "python", "ocr_service.py")

    // Ejecutamos el script en el entorno de conda `django_env`
    // En Windows, se puede usar conda run -n env_name python script.py
    const command = `conda run -n django_env python "${scriptPath}" "${url}"`
    
    console.log("Running OCR command:", command)

    const { stdout, stderr } = await execAsync(command)

    if (stderr && !stderr.includes("conda")) {
      console.warn("Python stderr:", stderr)
    }

    try {
      // Find JSON block in stdout (just in case there are warnings/logs printed by python/opencv before the json)
      const lines = stdout.split('\n');
      const jsonLine = lines.find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
      
      const parsedData = jsonLine ? JSON.parse(jsonLine) : JSON.parse(stdout);
      
      return NextResponse.json(parsedData)
    } catch (parseError) {
      console.error("Error parseando output JSON:", stdout, parseError)
      return NextResponse.json({ error: "Error parseando respuesta de OCR", raw: stdout }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error ejecutando OCR:", error)
    return NextResponse.json(
      { error: "Error en el servicio de OCR", details: error.message },
      { status: 500 }
    )
  }
}
