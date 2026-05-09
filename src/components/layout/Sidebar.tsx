import Link from 'next/link';
import { Home, Package, Store, ArrowRightLeft, BarChart2 } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8 font-bold text-2xl px-4 py-2 text-blue-400">
        StockFlow
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition">
          <Home size={20} /> Dashboard
        </Link>
        <Link href="/products" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition">
          <Package size={20} /> Productos
        </Link>
        <Link href="/branches" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition">
          <Store size={20} /> Sucursales
        </Link>
        <Link href="/movements" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition">
          <ArrowRightLeft size={20} /> Movimientos
        </Link>
        <Link href="/reports" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition">
          <BarChart2 size={20} /> Reportes
        </Link>
      </nav>
    </aside>
  );
}
