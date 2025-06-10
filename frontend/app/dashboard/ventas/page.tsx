"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Trash2, ShoppingCart, Calendar, User } from "lucide-react"
import { api } from "@/lib/api"
import VentaForm from "@/components/venta-form"
import VentaDetails from "@/components/venta-details"
import { useToast } from "@/hooks/use-toast"

interface Venta {
  id: number
  fechaVenta: string
  estado: number
  idVendedor: number
}

interface Usuario {
  id: number
  nombre: string
  primerApellido: string
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedVenta, setSelectedVenta] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchVentas()
    fetchUsuarios()
  }, [])

  const fetchVentas = async () => {
    try {
      const response = await api.get("/api/ventas")
      setVentas(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/api/usuarios")
      setUsuarios(response.data)
    } catch (error) {
      console.error("Error fetching usuarios:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta venta?")) {
      try {
        await api.delete(`/api/ventas/${id}`)
        toast({
          title: "Éxito",
          description: "Venta eliminada correctamente",
        })
        fetchVentas()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la venta",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (ventaId: number) => {
    setSelectedVenta(ventaId)
    setShowDetails(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    fetchVentas()
  }

  const handleDetailsClose = () => {
    setShowDetails(false)
    setSelectedVenta(null)
  }

  const getUsuarioName = (usuarioId: number) => {
    const usuario = usuarios.find((u) => u.id === usuarioId)
    return usuario ? `${usuario.nombre} ${usuario.primerApellido}` : "Usuario desconocido"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredVentas = ventas.filter((venta) => {
    const vendedorName = getUsuarioName(venta.idVendedor).toLowerCase()
    const ventaId = venta.id.toString()
    const searchLower = searchTerm.toLowerCase()

    return vendedorName.includes(searchLower) || ventaId.includes(searchLower)
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-green-600">Cargando ventas...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Ventas</h1>
            <p className="text-green-600">Gestiona las ventas realizadas</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            <Input
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVentas.map((venta) => (
            <Card key={venta.id} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg text-green-800">Venta #{venta.id}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(venta.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(venta.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(venta.fechaVenta)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{getUsuarioName(venta.idVendedor)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800">{venta.estado === 1 ? "Activa" : "Inactiva"}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(venta.id)}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVentas.length === 0 && (
          <Card className="border-green-200">
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">No se encontraron ventas</h3>
              <p className="text-green-600 mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza registrando tu primera venta"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Venta
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showForm && <VentaForm onClose={handleFormClose} />}

      {showDetails && selectedVenta && <VentaDetails ventaId={selectedVenta} onClose={handleDetailsClose} />}
    </DashboardLayout>
  )
}
