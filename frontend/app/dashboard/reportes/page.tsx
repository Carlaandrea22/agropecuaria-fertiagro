"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Venta {
  fechaVenta: string;
  producto: string;
  categoria: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export default function ReportesPage() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ganancia, setGanancia] = useState(0);

  const fetchVentas = async () => {
    try {
      const response = await api.get("/api/ventas/reporte", {
        params: { desde, hasta },
      });
      setVentas(response.data);

      const total = response.data.reduce(
        (sum: number, v: Venta) => sum + v.total,
        0
      );
      setGanancia(total);
    } catch (error) {
      console.error("Error al obtener ventas", error);
    }
  };

  const exportarPDF = () => {
  const url = new URL("http://localhost:4000/api/ventas/reporte/pdf");
  if (desde) url.searchParams.append("desde", desde);
  if (hasta) url.searchParams.append("hasta", hasta);
  window.open(url.toString(), "_blank");
};


  useEffect(() => {
    fetchVentas();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-800">📊 Reporte de Ventas</h1>

        {/* Filtros */}
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-sm text-green-700">Desde</label>
            <Input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-green-700">Hasta</label>
            <Input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
          <Button onClick={fetchVentas} className="bg-green-600 hover:bg-green-700">
            Filtrar
          </Button>
          <Button onClick={exportarPDF} variant="outline">
            Exportar PDF
          </Button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto border border-green-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-100 text-green-700">
              <tr>
                <th className="p-2">Fecha</th>
                <th className="p-2">Producto</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Precio Unitario</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{v.fechaVenta.split("T")[0]}</td>
                  <td className="p-2">{v.producto}</td>
                  <td className="p-2">{v.categoria}</td>
                  <td className="p-2">{v.cantidad}</td>
                  <td className="p-2">Bs. {v.precioUnitario.toFixed(2)}</td>
                  <td className="p-2 font-semibold text-green-800">
                    Bs. {v.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-green-500 p-4">
                    No hay ventas registradas en ese rango.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ganancia total */}
        <div className="text-right text-lg font-bold text-green-800">
          Ganancia estimada: Bs. {ganancia.toFixed(2)}
        </div>
      </div>
    </DashboardLayout>
  );
}
