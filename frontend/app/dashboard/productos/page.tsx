"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { api } from "@/lib/api"
import ProductForm from "@/components/product-form"
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

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await api.get("/api/productos")
      setProductos(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/api/categorias")
      setCategorias(response.data)
    } catch (error) {
      console.error("Error fetching categorias:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/api/productos/${id}`)
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        })
        fetchProductos()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProductos()
  }

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoriaName = (categoriaId: number) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria?.nombre || "Sin categoría"
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-green-600">Cargando productos...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Productos</h1>
            <p className="text-green-600">Gestiona tu inventario de productos</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map((producto) => (
            <Card key={producto.id} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg text-green-800">{producto.nombre}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(producto)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(producto.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion}</p>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-700">Bs{producto.precio}</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {getCategoriaName(producto.Categoria_id)}
                  </Badge>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Stock: {producto.stock}</span>
                  <span>{producto.unidadDeMedida}</span>
                </div>

                <div className="w-full bg-green-100 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((producto.stock / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProductos.length === 0 && (
          <Card className="border-green-200">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">No se encontraron productos</h3>
              <p className="text-green-600 mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showForm && <ProductForm producto={editingProduct} categorias={categorias} onClose={handleFormClose} />}
    </DashboardLayout>
  )
}
