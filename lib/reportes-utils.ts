export const generarReportePDF = async (datos: any, tipo: string) => {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF()

  doc.setFont("Helvetica", "bold")
  doc.setFontSize(16)
  doc.text(`Reporte de ${tipo}`, 10, 10)

  doc.setFont("Helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 25)

  return doc.output("blob")
}

export const calcularDiasParaVencer = (fecha: string): number => {
  const hoy = new Date()
  const vencimiento = new Date(fecha)
  const diferencia = vencimiento.getTime() - hoy.getTime()
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
}

export const formatearDuracion = (minutos: number): string => {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return `${horas}h ${mins}m`
}

export const calcularVariacionTiempo = (estimado: number, real: number): number => {
  return real - estimado
}

export const formatearDistancia = (km: number): string => {
  return `${km.toFixed(2)} km`
}

export const estadoLicencia = (vencimiento: string): "vigente" | "proximo" | "vencido" => {
  const dias = calcularDiasParaVencer(vencimiento)
  if (dias < 0) return "vencido"
  if (dias < 30) return "proximo"
  return "vigente"
}
