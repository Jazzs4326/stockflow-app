'use client';
import { useState, useEffect } from 'react';
import { Package, Store, ArrowRightLeft, AlertCircle, Play } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, branches: 0, pendingMovements: 0 });
  const [stock, setStock] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/branches').then(r => r.json()),
      fetch('/api/movements?status=pending').then(r => r.json()),
      fetch('/api/reports?type=stock').then(r => r.json())
    ]).then(([p, b, m, s]) => {
      setStats({ 
        products: Array.isArray(p) ? p.length : 0, 
        branches: Array.isArray(b) ? b.length : 0, 
        pendingMovements: Array.isArray(m) ? m.length : 0 
      });
      setStock(Array.isArray(s) ? s : []);
    });
  }, []);

  const triggerWorker = async () => {
    await fetch('/api/cron/process-movements');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package size={24}/></div>
          <div><p className="text-sm text-slate-500">Productos</p><p className="text-2xl font-bold">{stats.products}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full"><Store size={24}/></div>
          <div><p className="text-sm text-slate-500">Sucursales</p><p className="text-2xl font-bold">{stats.branches}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><ArrowRightLeft size={24}/></div>
          <div><p className="text-sm text-slate-500">Pendientes</p><p className="text-2xl font-bold">{stats.pendingMovements}</p></div>
        </div>
        
        <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm flex flex-col justify-center items-start">
          <p className="text-sm text-slate-300 mb-2">Simular Worker Asíncrono</p>
          <button onClick={triggerWorker} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm flex items-center gap-2 w-full justify-center transition">
            <Play size={16}/> Procesar Pendientes
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Stock por Sucursal</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Sucursal</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s: any) => (
              <tr key={s._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 font-medium">{s.productId?.name || 'N/A'} <span className="text-xs text-slate-400 ml-2">{s.productId?.sku}</span></td>
                <td className="p-4">{s.branchId?.name || 'N/A'}</td>
                <td className="p-4 font-bold">{s.quantity}</td>
                <td className="p-4">
                  {s.quantity <= 5 ? (
                    <span className="flex items-center gap-1 text-red-500 text-sm font-medium"><AlertCircle size={16}/> Bajo Stock</span>
                  ) : (
                    <span className="text-green-500 text-sm font-medium">Suficiente</span>
                  )}
                </td>
              </tr>
            ))}
            {stock.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No hay stock registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
