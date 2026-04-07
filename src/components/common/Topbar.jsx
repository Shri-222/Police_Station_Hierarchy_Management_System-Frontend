import {
  Search,
  Bell,
  History } from 'lucide-react';

export default function Topbar({ onAdd, loading }) {
  return (
    <header className="h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between">
      <div className="max-w-xl w-full">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Global Search Ledger..."
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-sm font-semibold text-blue-700 border-b-2 border-blue-600 pb-1">
          Dashboard
        </button>
        <button className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Analytics
        </button>
        <button className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Reports
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button className="p-2 text-slate-600 hover:text-slate-900">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-600 hover:text-slate-900">
          <History className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition">
          Export
        </button>
        <button  onClick={onAdd} 
                disabled={loading}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Add Unit
        </button>
      </div>
    </header>
  );
}