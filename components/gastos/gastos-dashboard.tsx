"use client"

import { useMemo } from "react"
import { useGastos } from "@/hooks/use-gastos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { DollarSign, Receipt, TrendingUp, Calendar, Loader2, Inbox, Image } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"

// ─── Color maps ────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Combustible: "#10b981",
  Peaje: "#3b82f6",
  Mantenimiento: "#f59e0b",
  Reparación: "#ef4444",
  Comidas: "#8b5cf6",
  Hospedaje: "#ec4899",
  Otro: "#6b7280",
}

const BADGE_VARIANTS: Record<string, { bg: string; text: string }> = {
  Combustible: { bg: "bg-emerald-100", text: "text-emerald-800" },
  Peaje: { bg: "bg-blue-100", text: "text-blue-800" },
  Mantenimiento: { bg: "bg-amber-100", text: "text-amber-800" },
  Reparación: { bg: "bg-red-100", text: "text-red-800" },
  Comidas: { bg: "bg-violet-100", text: "text-violet-800" },
  Hospedaje: { bg: "bg-pink-100", text: "text-pink-800" },
  Otro: { bg: "bg-gray-100", text: "text-gray-800" },
}

// ─── Pie chart label renderer ──────────────────────────────────────────────────
const RADIAN = Math.PI / 180
function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.05) return null
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────
interface KPICardProps {
  label: string
  value: string
  icon: React.ReactNode
  gradient: string
  delay: number
}

function KPICard({ label, value, icon, gradient, delay }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-forest-green-900 tracking-tight">
                {value}
              </p>
            </div>
            <div
              className={`flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Tooltip styles (shared) ───────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export function GastosDashboard() {
  const { data: gastos, isLoading } = useGastos()

  // ── Computed data ──────────────────────────────────────────────────────────
  const { totalGastos, cantidadGastos, promedioGasto, gastosEsteMes } =
    useMemo(() => {
      if (!gastos || gastos.length === 0)
        return {
          totalGastos: 0,
          cantidadGastos: 0,
          promedioGasto: 0,
          gastosEsteMes: 0,
        }

      const now = new Date()
      const monthStart = startOfMonth(now)
      const monthEnd = endOfMonth(now)
      const total = gastos.reduce((sum, g) => sum + Number(g.monto), 0)

      const thisMonth = gastos
        .filter((g) => {
          const d = new Date(g.fecha)
          return isWithinInterval(d, { start: monthStart, end: monthEnd })
        })
        .reduce((sum, g) => sum + Number(g.monto), 0)

      return {
        totalGastos: total,
        cantidadGastos: gastos.length,
        promedioGasto: gastos.length > 0 ? total / gastos.length : 0,
        gastosEsteMes: thisMonth,
      }
    }, [gastos])

  // ── Pie chart data ─────────────────────────────────────────────────────────
  const pieData = useMemo(() => {
    if (!gastos) return []
    const grouped: Record<string, number> = {}
    gastos.forEach((g) => {
      grouped[g.tipoGasto] = (grouped[g.tipoGasto] || 0) + Number(g.monto)
    })
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Otro,
    }))
  }, [gastos])

  // ── Bar chart data (last 6 months) ────────────────────────────────────────
  const barData = useMemo(() => {
    if (!gastos) return []
    const now = new Date()
    const months: { key: string; label: string; start: Date; end: Date }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i)
      const s = startOfMonth(d)
      const e = endOfMonth(d)
      months.push({
        key: format(d, "yyyy-MM"),
        label: format(d, "MMM yyyy", { locale: es }),
        start: s,
        end: e,
      })
    }

    return months.map((m) => {
      const total = gastos
        .filter((g) => {
          const d = new Date(g.fecha)
          return isWithinInterval(d, { start: m.start, end: m.end })
        })
        .reduce((sum, g) => sum + Number(g.monto), 0)
      return { mes: m.label, monto: Math.round(total * 100) / 100 }
    })
  }, [gastos])

  // ── Recent gastos ─────────────────────────────────────────────────────────
  const recentGastos = useMemo(() => {
    if (!gastos) return []
    return [...gastos]
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )
      .slice(0, 10)
  }, [gastos])

  // ── Format currency ────────────────────────────────────────────────────────
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Loader2 className="h-10 w-10 text-forest-green-600" />
        </motion.div>
        <p className="text-gray-500 font-medium">Cargando gastos…</p>
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!gastos || gastos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
      >
        <Inbox className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">
          No hay gastos registrados
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Comienza registrando tu primer gasto
        </p>
      </motion.div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Row 1: KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Gastos"
          value={`Bs ${fmt(totalGastos)}`}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          gradient="from-emerald-500 to-teal-600"
          delay={0}
        />
        <KPICard
          label="Cantidad de Gastos"
          value={cantidadGastos.toString()}
          icon={<Receipt className="h-5 w-5 text-white" />}
          gradient="from-blue-500 to-indigo-600"
          delay={0.1}
        />
        <KPICard
          label="Promedio por Gasto"
          value={`Bs ${fmt(promedioGasto)}`}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          gradient="from-amber-500 to-orange-600"
          delay={0.2}
        />
        <KPICard
          label="Gastos Este Mes"
          value={`Bs ${fmt(gastosEsteMes)}`}
          icon={<Calendar className="h-5 w-5 text-white" />}
          gradient="from-purple-500 to-violet-600"
          delay={0.3}
        />
      </div>

      {/* ── Row 2: Charts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart — Gastos por Categoría */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Gastos por Categoría</CardTitle>
              <CardDescription>
                Distribución del gasto por tipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieLabel}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `Bs ${fmt(value)}`,
                        name,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string) => (
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart — Tendencia Mensual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Tendencia Mensual</CardTitle>
              <CardDescription>
                Gastos de los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="mes"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(v: number) => `${v}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `Bs ${fmt(value)}`,
                        "Monto",
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Bar
                      dataKey="monto"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Row 3: Recent Gastos Table ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Gastos Recientes</CardTitle>
            <CardDescription>
              Últimos 10 gastos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Comprobante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGastos.map((gasto) => {
                  const badgeStyle = BADGE_VARIANTS[gasto.tipoGasto] || BADGE_VARIANTS.Otro
                  return (
                    <TableRow key={gasto.id}>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}
                        >
                          {gasto.tipoGasto}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {fmt(Number(gasto.monto))}
                      </TableCell>
                      <TableCell>
                        <Badge>{gasto.moneda}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(gasto.fecha), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate text-gray-500"
                        title={gasto.descripcion || ""}
                      >
                        {gasto.descripcion || "—"}
                      </TableCell>
                      <TableCell>
                        {gasto.imagenComprobanteUrl ? (
                          <a
                            href={gasto.imagenComprobanteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <div className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-emerald-400 transition-all">
                              <Image className="h-full w-full text-gray-400 p-1.5" />
                            </div>
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
