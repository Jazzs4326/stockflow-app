'use client';
import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        if(data.movementsAgg) setReportData(data.movementsAgg);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Operaciones</h1>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-slate-50">
          <h2 className="font-semibold text-lg">Resumen de Movimientos Históricos</h2>
          <p className="text-sm text-slate-500">Agrupados por tipo y estado de procesamiento.</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4">Tipo</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Cantidad de Ops.</th>
              <th className="p-4">Unidades Totales Movidas</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row: any, idx) => (
              <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 capitalize font-medium">{row._id.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${row._id.status === 'pending' ? 'bg-orange-100 text-orange-700' : row._id.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {row._id.status}
                  </span>
                </td>
                <td className="p-4">{row.count}</td>
                <td className="p-4 font-bold">{row.totalQuantity}</td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No hay datos suficientes para el reporte.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
