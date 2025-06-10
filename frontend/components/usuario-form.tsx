"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Usuario {
  id: number
  nombre: string
  primerApellido: string
  segundoApellido?: string
  correo: string
  rol: string
  telefono: string
  imagen?: string
  estado: number
}

interface UsuarioFormProps {
  usuario?: Usuario | null
  onClose: () => void
}

export default function UsuarioForm({ usuario, onClose }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    rol: "",
    telefono: "",
    imagen: "",
    contraseña: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido || "",
        correo: usuario.correo,
        rol: usuario.rol,
        telefono: usuario.telefono,
        imagen: usuario.imagen || "",
        contraseña: "", // No mostrar contraseña existente
      })
    }
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.primerApellido || !formData.correo || !formData.rol || !formData.telefono) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    if (!usuario && !formData.contraseña) {
      toast({
        title: "Error",
        description: "La contraseña es obligatoria para nuevos usuarios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const data: Partial<typeof formData> = { ...formData };
      if (!data.contraseña) {
        delete data.contraseña // No enviar contraseña vacía en actualizaciones
      }

      if (usuario) {
        await api.put(`/api/usuarios/${usuario.id}`, data)
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
        })
      } else {
        await api.post("/api/usuarios", data)
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        })
      }

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al guardar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">{usuario ? "Editar Usuario" : "Nuevo Usuario"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Nombre"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primerApellido">Primer Apellido *</Label>
                <Input
                  id="primerApellido"
                  value={formData.primerApellido}
                  onChange={(e) => handleChange("primerApellido", e.target.value)}
                  placeholder="Primer apellido"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                <Input
                  id="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={(e) => handleChange("segundoApellido", e.target.value)}
                  placeholder="Segundo apellido (opcional)"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  placeholder="Número de teléfono"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={(value) => handleChange("rol", value)} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen (opcional)</Label>
                <Input
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => handleChange("imagen", e.target.value)}
                  placeholder="nombre-imagen.jpg"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña">
                {usuario ? "Nueva Contraseña (dejar vacío para mantener actual)" : "Contraseña *"}
              </Label>
              <Input
                id="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => handleChange("contraseña", e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : usuario ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
