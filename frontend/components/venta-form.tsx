"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Loader2, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
}

interface DetalleVenta {
  idProducto: number
  cantidad: number
  precioUnitario: number
}

interface VentaFormProps {
  onClose: () => void
}

export default function VentaForm({ onClose }: VentaFormProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [detalles, setDetalles] = useState<DetalleVenta[]>([{ idProducto: 0, cantidad: 1, precioUnitario: 0 }])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [qr, setQr] = useState<string | null>(null);


  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await api.get("/api/productos")
      setProductos(response.data)
    } catch (error) {
      console.error("Error fetching productos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const detallesValidos = detalles.filter((d) => d.idProducto > 0 && d.cantidad > 0)

    if (detallesValidos.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un producto a la venta",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await api.post("/api/ventas", {
        idVendedor: user?.id,
        detalles: detallesValidos,
      })

      toast({
        title: "Éxito",
        description: "Venta registrada correctamente",
      })

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al registrar la venta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDetalleChange = (index: number, field: keyof DetalleVenta, value: string | number) => {
    const newDetalles = [...detalles]
    newDetalles[index] = { ...newDetalles[index], [field]: value }

    // Si se selecciona un producto, actualizar el precio automáticamente
    if (field === "idProducto") {
      const producto = productos.find((p) => p.id === Number(value))
      if (producto) {
        newDetalles[index].precioUnitario = producto.precio
      }
    }

    setDetalles(newDetalles)
  }

  const agregarDetalle = () => {
    setDetalles([...detalles, { idProducto: 0, cantidad: 1, precioUnitario: 0 }])
  }

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((_, i) => i !== index))
    }
  }

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      return total + detalle.cantidad * detalle.precioUnitario
    }, 0)
  }

  const generarQR = async () => {
  const total = calcularTotal();
  const url = `https://mi-pasarela.com/pago?monto=${total.toFixed(2)}`; // puedes personalizar el link

  try {
const res = await api.get("http://localhost:4000/api/qr/generar", {
      params: { texto: url },
    });
    setQr(res.data.qr);
  } catch (error) {
    console.error("Error generando QR:", error);
  }
};


  const getProductoStock = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId)
    return producto?.stock || 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Nueva Venta</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-green-800">Productos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={agregarDetalle}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {detalles.map((detalle, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Producto</Label>
                        <Select
                          value={detalle.idProducto.toString()}
                          onValueChange={(value) => handleDetalleChange(index, "idProducto", Number.parseInt(value))}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.map((producto) => (
                              <SelectItem key={producto.id} value={producto.id.toString()}>
                                {producto.nombre} (Stock: {producto.stock})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          max={getProductoStock(detalle.idProducto)}
                          value={detalle.cantidad}
                          onChange={(e) => handleDetalleChange(index, "cantidad", Number.parseInt(e.target.value) || 1)}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Precio Unitario</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.precioUnitario}
                          onChange={(e) =>
                            handleDetalleChange(index, "precioUnitario", Number.parseFloat(e.target.value) || 0)
                          }
                          disabled={loading}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-green-800">
                          ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                        </div>
                        {detalles.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarDetalle(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="border-t border-green-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-green-800">
                <span>Total de la Venta:</span>
                <span>Bs{calcularTotal().toFixed(2)}</span>
              </div>
            </div>

<div className="pt-4 space-y-4">
  <div className="text-center">
    <Button
      type="button"
      variant="outline"
      onClick={generarQR}
      className="text-green-700 border-green-400 hover:bg-green-50"
    >
      Generar QR para Pago
    </Button>

    {qr && (
      <div className="mt-4">
        <img src={qr} alt="Código QR" className="mx-auto w-40 h-40" />
        <p className="text-sm text-green-600 mt-2">Escanea para realizar el pago</p>
      </div>
    )}
  </div>

  <div className="flex justify-end space-x-2">
    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
      Cancelar
    </Button>
    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registrando...
        </>
      ) : (
        "Registrar Venta"
      )}
    </Button>
  </div>
</div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
