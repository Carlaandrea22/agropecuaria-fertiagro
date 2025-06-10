"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, User, Package } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DetalleVenta {
  idVenta: number
  idProducto: number
  cantidad: number
  precioUnitario: number
}

interface VentaCompleta {
  id: number
  fechaVenta: string
  estado: number
  idVendedor: number
  detalles: DetalleVenta[]
}

interface Producto {
  id: number
  nombre: string
}

interface Usuario {
  id: number
  nombre: string
  primerApellido: string
}

interface VentaDetailsProps {
  ventaId: number
  onClose: () => void
}

export default function VentaDetails({ ventaId, onClose }: VentaDetailsProps) {
  const [venta, setVenta] = useState<VentaCompleta | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchVentaDetails()
    fetchProductos()
    fetchUsuarios()
  }, [ventaId])

  const fetchVentaDetails = async () => {
    try {
      const response = await api.get(`/api/ventas/${ventaId}`)
      setVenta(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles de la venta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProductos = async () => {
    try {
      const response = await api.get("/api/productos")
      setProductos(response.data)
    } catch (error) {
      console.error("Error fetching productos:", error)
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

  const getProductoName = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId)
    return producto?.nombre || "Producto desconocido"
  }

  const getUsuarioName = (usuarioId: number) => {
    const usuario = usuarios.find((u) => u.id === usuarioId)
    return usuario ? `${usuario.nombre} ${usuario.primerApellido}` : "Usuario desconocido"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calcularTotal = () => {
    if (!venta) return 0
    return venta.detalles.reduce((total, detalle) => {
      return total + detalle.cantidad * detalle.precioUnitario
    }, 0)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <div className="text-green-600">Cargando detalles de la venta...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!venta) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <div className="text-red-600">No se pudo cargar la venta</div>
            <Button onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Detalles de Venta #{venta.id}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Fecha de Venta</span>
                </div>
                <p className="text-gray-600">{formatDate(venta.fechaVenta)}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Vendedor</span>
                </div>
                <p className="text-gray-600">{getUsuarioName(venta.idVendedor)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-green-800">Estado</h3>
            <Badge className="bg-green-100 text-green-800">{venta.estado === 1 ? "Activa" : "Inactiva"}</Badge>
          </div>

          {/* Productos vendidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-800 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos Vendidos
            </h3>

            <div className="space-y-3">
              {venta.detalles.map((detalle, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-medium text-green-800">{getProductoName(detalle.idProducto)}</p>
                        <p className="text-sm text-gray-600">ID: {detalle.idProducto}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Cantidad</p>
                        <p className="font-medium">{detalle.cantidad}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Precio Unitario</p>
                        <p className="font-medium">Bs{detalle.precioUnitario.toFixed(2)}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="font-bold text-green-700">
                          ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-green-200 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-green-800">
              <span>Total de la Venta:</span>
              <span>Bs{calcularTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
