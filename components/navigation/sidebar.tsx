"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Users,
  Truck,
  Route,
  Wrench,
  UserCircle,
  ChevronDown,
  Radio,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/logo"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios y Roles",
    href: "/dashboard/users-roles",
    icon: Users,
  },
  {
    title: "Vehículos",
    href: "/dashboard/vehiculos",
    icon: Truck,
  },
  {
    title: "Rutas",
    href: "/dashboard/rutas",
    icon: Route,
  },
  {
    title: "Viajes",
    href: "/dashboard/viajes",
    icon: MapPin,
  },
  {
    title: "GPS",
    icon: Radio,
    submenu: [
      {
        title: "Tracking en Vivo",
        href: "/dashboard/gps-tracking",
      },
      {
        title: "Dispositivos GPS",
        href: "/dashboard/dispositivos-gps",
      },
    ],
  },
  {
    title: "Conductores",
    icon: UserCircle,
    submenu: [
      {
        title: "Conductores",
        href: "/dashboard/conductores",
      },
      {
        title: "Documentos",
        href: "/dashboard/documentos-conductor",
      },
    ],
  },
  {
    title: "Mantenimiento",
    href: "/dashboard/mantenimiento",
    icon: Wrench,
  },
  {
    title: "Ajustes",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-forest-green-900">
      <div className="flex h-16 items-center justify-center border-b border-forest-green-800 px-6">
        <Logo variant="light" />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          if (item.submenu) {
            const isOpen = openSubmenu === item.title
            const isAnySubmenuActive = item.submenu.some((sub) => pathname === sub.href)
            const Icon = item.icon

            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isAnySubmenuActive
                      ? "bg-forest-green-800 text-white"
                      : "text-gray-300 hover:bg-forest-green-800 hover:text-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isActive = pathname === subItem.href

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-vibrant-orange-500 text-white"
                              : "text-gray-300 hover:bg-forest-green-800 hover:text-white",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // Items normales sin submenu
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-vibrant-orange-500 text-white"
                  : "text-gray-300 hover:bg-forest-green-800 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
