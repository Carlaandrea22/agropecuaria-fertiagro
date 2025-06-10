"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"

interface User {
  id: number
  nombre: string
  primerApellido: string
  segundoApellido?: string
  correo: string
  rol: string
  telefono: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (correo: string, contraseña: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      // Configurar el token en axios
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`
    }

    setLoading(false)
  }, [])

  const login = async (correo: string, contraseña: string) => {
    try {
const response = await api.post("/api/login/", { correo, contraseña })
      const { usuario, token: newToken } = response.data

      setUser(usuario)
      setToken(newToken)

      // Guardar en localStorage
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(usuario))

      // Configurar el token en axios
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || "Error al iniciar sesión")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
