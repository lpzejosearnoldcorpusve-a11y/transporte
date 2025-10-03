import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next" 
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Transporte de Hidrocarburos",
  description: "Plataforma de gestión para transporte de hidrocarburos",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>

        {/* Analytics de Vercel */}
        <Analytics />

        {/* Speed Insights de Vercel */}
        <SpeedInsights />  {/* Speed Insights de Vercel */}
      </body>
    </html>
  )
}
