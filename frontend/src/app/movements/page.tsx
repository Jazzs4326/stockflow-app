'use client';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function MovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ productId: '', sourceBranch: '', destinationBranch: '', quantity: 1, type: 'entrada' });

  const loadData = async () => {
    const [movs, prods, brans] = await Promise.all([
      fetch('/api/movements').then(r => r.json()).catch(() => []),
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/branches').then(r => r.json()).catch(() => [])
    ]);
    setMovements(Array.isArray(movs) ? movs : []);
    setProducts(Array.isArray(prods) ? prods : []);
    setBranches(Array.isArray(brans) ? brans : []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form, quantity: Number(form.quantity) };
    if (form.type === 'entrada') delete payload.sourceBranch;
    if (form.type === 'salida') delete payload.destinationBranch;
    
    await fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setForm({ productId: '', sourceBranch: '', destinationBranch: '', quantity: 1, type: 'entrada' });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Movimientos de Inventario</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div><label className="block text-sm font-medium mb-1">Tipo de Movimiento</label>
          <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border rounded p-2">
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">Producto</label>
          <select required value={form.productId} onChange={e=>setForm({...form, productId: e.target.value})} className="w-full border rounded p-2">
            <option value="">Seleccione...</option>
            {products.map((p:any) => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">Cantidad</label>
          <input required type="number" min="1" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} className="w-full border rounded p-2" />
        </div>
        
        {(form.type === 'salida' || form.type === 'transferencia') && (
          <div><label className="block text-sm font-medium mb-1">Sucursal Origen</label>
            <select required value={form.sourceBranch} onChange={e=>setForm({...form, sourceBranch: e.target.value})} className="w-full border rounded p-2">
              <option value="">Seleccione...</option>
              {branches.map((b:any) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        )}
        
        {(form.type === 'entrada' || form.type === 'transferencia') && (
          <div><label className="block text-sm font-medium mb-1">Sucursal Destino</label>
            <select required value={form.destinationBranch} onChange={e=>setForm({...form, destinationBranch: e.target.value})} className="w-full border rounded p-2">
              <option value="">Seleccione...</option>
              {branches.map((b:any) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        )}
        
        <div className="col-span-full flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={18}/> Registrar Movimiento
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Producto</th>
              <th className="p-4">Origen</th>
              <th className="p-4">Destino</th>
              <th className="p-4">Cant.</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m: any) => (
              <tr key={m._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-500">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-4 capitalize">{m.type}</td>
                <td className="p-4">{m.productId?.name}</td>
                <td className="p-4">{m.sourceBranch?.name || '-'}</td>
                <td className="p-4">{m.destinationBranch?.name || '-'}</td>
                <td className="p-4 font-bold">{m.quantity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${m.status === 'pending' ? 'bg-orange-100 text-orange-700' : m.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {m.status}
                  </span>
                  {m.errorMessage && <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={m.errorMessage}>{m.errorMessage}</p>}
                </td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No hay movimientos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
