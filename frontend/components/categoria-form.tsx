"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Categoria {
  id: number
  nombre: string
}

interface CategoriaFormProps {
  categoria?: Categoria | null
  onClose: () => void
}

export default function CategoriaForm({ categoria, onClose }: CategoriaFormProps) {
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre)
    }
  }, [categoria])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de la categoría",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (categoria) {
        await api.put(`/api/categorias/${categoria.id}`, { nombre })
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente",
        })
      } else {
        await api.post("/api/categorias", { nombre })
        toast({
          title: "Éxito",
          description: "Categoría creada correctamente",
        })
      }

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al guardar la categoría",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">{categoria ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Categoría</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Fertilizantes, Insecticidas..."
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
                ) : categoria ? (
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
