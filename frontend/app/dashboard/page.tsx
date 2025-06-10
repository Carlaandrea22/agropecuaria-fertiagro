"use client";

import { useAuth } from "@/contexts/auth-context";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Users,
  ShoppingCart,
  Tag,
  DollarSign,
  BarChart2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    productos: 0,
    usuarios: 0,
    ventas: 0,
    categorias: 0,
  });

  const [totales, setTotales] = useState({
    dia: 0,
    semana: 0,
    mes: 0,
  });

  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [porCategoria, setPorCategoria] = useState<any[]>([]);
  const [stockBajo, setStockBajo] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          productos,
          usuarios,
          ventas,
          categorias,
          resTotales,
          resMasVendidos,
          resPorCategoria,
          resStockBajo,
        ] = await Promise.all([
          api.get("/api/productos"),
          api.get("/api/usuarios"),
          api.get("/api/ventas"),
          api.get("/api/categorias"),
          api.get("/api/ventas/totales"),
          api.get("/api/productos/mas-vendidos"),
          api.get("/api/ventas/por-categoria"),
          api.get("/api/productos/stock-bajo"),
        ]);

        setStats({
          productos: productos.data.length,
          usuarios: usuarios.data.length,
          ventas: ventas.data.length,
          categorias: categorias.data.length,
        });

        setTotales({
          dia: resTotales.data.total_dia,
          semana: resTotales.data.total_semana,
          mes: resTotales.data.total_mes,
        });

        setMasVendidos(resMasVendidos.data);
        setPorCategoria(resPorCategoria.data);
        setStockBajo(resStockBajo.data);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-green-800">¡Bienvenido, {user?.nombre}! 🌱</h1>
          <p className="text-green-600 mt-2">Panel de control de FertiAgro</p>
        </div>

        {/* Conteo general */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Productos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.productos}</div>
              <p className="text-xs text-green-600">Productos activos</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.usuarios}</div>
              <p className="text-xs text-green-600">Usuarios registrados</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Ventas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.ventas}</div>
              <p className="text-xs text-green-600">Ventas realizadas</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Categorías</CardTitle>
              <Tag className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.categorias}</div>
              <p className="text-xs text-green-600">Categorías disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Totales monetarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-green-700">Hoy</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-800">
                Bs. {totales.dia.toFixed(2)}
              </div>
              <p className="text-xs text-green-600">Total vendido hoy</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-green-700">Esta Semana</CardTitle>
              <BarChart2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-800">
                Bs. {totales.semana.toFixed(2)}
              </div>
              <p className="text-xs text-green-600">Total semanal</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-green-700">Este Mes</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-800">
                Bs. {totales.mes.toFixed(2)}
              </div>
              <p className="text-xs text-green-600">Total mensual</p>
            </CardContent>
          </Card>
        </div>

        {/* Productos más vendidos */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🥇 Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-green-700 text-sm space-y-2">
              {masVendidos.map((prod, index) => (
                <li key={prod.id}>
                  {index + 1}. {prod.nombre} — {prod.total_vendido} uds.
                </li>
              ))}
              {masVendidos.length === 0 && (
                <li className="text-green-500">No hay ventas registradas aún.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Ventas por categoría */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">📊 Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-green-700 text-sm space-y-2">
              {porCategoria.map((cat) => (
                <li key={cat.categoria}>
                  {cat.categoria}: Bs. {cat.total.toFixed(2)}
                </li>
              ))}
              {porCategoria.length === 0 && (
                <li className="text-green-500">No hay datos por categoría aún.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Productos con bajo stock */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Productos con Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-red-700 text-sm space-y-2">
              {stockBajo.map((p) => (
                <li key={p.id}>
                  {p.nombre} — Stock: {p.stock}
                </li>
              ))}
              {stockBajo.length === 0 && (
                <li className="text-green-500">Todos los productos tienen stock suficiente.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
