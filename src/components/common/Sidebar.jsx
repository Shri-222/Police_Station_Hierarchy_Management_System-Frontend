import {
  MapPin,
  Layers,
  Building2,
  Target,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  Shield
} from 'lucide-react';


export default function Sidebar({ onLogout, user, onAdd, loading }) {
  const nav = [
    { label: 'Zones', icon: MapPin, active: true },
    { label: 'Ranges', icon: Layers },
    { label: 'Districts', icon: Building2 },
    { label: 'Circles', icon: Target },
    { label: 'Stations', icon: Home },
  ];

  return (
    <aside className="w-[290px] bg-white border-r border-slate-200 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                The Sovereign Ledger
              </h2>
              <p className="text-[11px] tracking-[0.25em] uppercase text-slate-500 mt-1">
                Institutional Hierarchy
              </p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-5 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <button onClick={onAdd} 
                disabled={loading}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-blue-200 transition">
          Add New Unit
        </button>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center">
              <span className="text-slate-600 font-bold">U</span>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {user?.email || 'Officer'}
              </div>
              <div className="text-xs text-slate-500">Assigned Unit</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition">
              <HelpCircle className="w-4 h-4" />
              Support
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}