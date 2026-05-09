'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', location: '' });

  const loadBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch(e) { setBranches([]); }
    setLoading(false);
  };

  useEffect(() => { loadBranches(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', location: '' });
    loadBranches();
  };

  const handleDelete = async (id: string) => {
    if(!confirm('¿Seguro de eliminar esta sucursal?')) return;
    await fetch(`/api/branches/${id}`, { method: 'DELETE' });
    loadBranches();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sucursales</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8 flex gap-4 items-end">
        <div className="flex-1"><label className="block text-sm font-medium mb-1">Nombre</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border rounded p-2" /></div>
        <div className="flex-1"><label className="block text-sm font-medium mb-1">Ubicación</label><input required value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full border rounded p-2" /></div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Crear</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b: any) => (
              <tr key={b._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 font-medium">{b.name}</td>
                <td className="p-4 text-slate-600">{b.location}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && !loading && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">No hay sucursales.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
