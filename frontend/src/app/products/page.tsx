'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ sku: '', name: '', price: '', category: '' });

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch(e) { setProducts([]); }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setForm({ sku: '', name: '', price: '', category: '' });
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if(!confirm('¿Seguro de eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8 flex gap-4 items-end">
        <div className="flex-1"><label className="block text-sm font-medium mb-1">SKU</label><input required value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} className="w-full border rounded p-2" /></div>
        <div className="flex-1"><label className="block text-sm font-medium mb-1">Nombre</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border rounded p-2" /></div>
        <div className="flex-1"><label className="block text-sm font-medium mb-1">Categoría</label><input required value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border rounded p-2" /></div>
        <div className="w-24"><label className="block text-sm font-medium mb-1">Precio</label><input required type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="w-full border rounded p-2" /></div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Crear</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 font-mono text-sm">{p.sku}</td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{p.category}</span>
                </td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
