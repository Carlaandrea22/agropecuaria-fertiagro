"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion: string
  stock: number
  unidadDeMedida: string
  imagen?: string
  Categoria_id: number
  estado: number
}

interface Categoria {
  id: number
  nombre: string
}

interface ProductFormProps {
  producto?: Producto | null
  categorias: Categoria[]
  onClose: () => void
}

export default function ProductForm({ producto, categorias, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    unidadDeMedida: "",
    imagen: "",
    Categoria_id: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        descripcion: producto.descripcion,
        stock: producto.stock.toString(),
        unidadDeMedida: producto.unidadDeMedida,
        imagen: producto.imagen || "",
        Categoria_id: producto.Categoria_id.toString(),
      })
    }
  }, [producto])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.descripcion ||
      !formData.stock ||
      !formData.unidadDeMedida ||
      !formData.Categoria_id
    ) {

      if (parseFloat(formData.precio) <= 0 || parseInt(formData.stock) <= 0) {
  toast({
    title: "Error",
    description: "El precio y el stock deben ser mayores a cero",
    variant: "destructive",
  })
  return
}

      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const data = {
        ...formData,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock),
        Categoria_id: Number.parseInt(formData.Categoria_id),
      }

      if (producto) {
        await api.put(`/api/productos/${producto.id}`, data)
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        })
      } else {
        await api.post("/api/productos", data)
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        })
      }

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al guardar el producto",
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
          <CardTitle className="text-green-800">{producto ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
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
                  placeholder="Nombre del producto"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio *</Label>
                <Input
  id="precio"
  type="number"
  step="0.01"
  min={0.01}
  value={formData.precio}
  onChange={(e) => handleChange("precio", e.target.value)}
  placeholder="0.00"
  disabled={loading}
/>

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder="Descripción del producto"
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
  id="stock"
  type="number"
  min={1}
  value={formData.stock}
  onChange={(e) => handleChange("stock", e.target.value)}
  placeholder="1"
  disabled={loading}
/>

              </div>

              <div className="space-y-2">
                <Label htmlFor="unidadDeMedida">Unidad de Medida *</Label>
                <Input
                  id="unidadDeMedida"
                  value={formData.unidadDeMedida}
                  onChange={(e) => handleChange("unidadDeMedida", e.target.value)}
                  placeholder="Kg, L, Unidades, etc."
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.Categoria_id}
                  onValueChange={(value) => handleChange("Categoria_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                ) : producto ? (
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
