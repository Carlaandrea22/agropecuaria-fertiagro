"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Menu, X, Home, Package, Tag, Users,
  ShoppingCart, LogOut, User, BarChart2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = user?.rol === "Admin" || user?.rol === "superadmin"
  const isVendedor = user?.rol === "vendedor"

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart },
    ...(isAdmin
      ? [
          { name: "Categorías", href: "/dashboard/categorias", icon: Tag },
          { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
          { name: "Reportes", href: "/dashboard/reportes", icon: BarChart2 },
        ]
      : []),
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const renderNav = () =>
    navigation.map((item) => {
      const Icon = item.icon
      const isActive = pathname === item.href
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
            isActive ? "bg-green-100 text-green-900" : "text-gray-600 hover:bg-green-50 hover:text-green-900"
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <Icon className="mr-3 h-5 w-5" />
          {item.name}
        </Link>
      )
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-green-200">
            <h1 className="text-xl font-bold text-green-800">FertiAgro</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">{renderNav()}</nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-green-200 shadow-sm">
          <div className="flex h-16 items-center px-4 border-b border-green-200">
            <h1 className="text-xl font-bold text-green-800">FertiAgro</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">{renderNav()}</nav>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-green-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nombre} {user?.primerApellido}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
