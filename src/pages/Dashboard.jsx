import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Bell,
  History,
  MapPin,
  Layers,
  Building2,
  Target,
  Home,
  Settings,
  HelpCircle,
  ArrowRight,
  Filter,
  AlignJustify,
  Loader2,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  BadgeCheck,
  TreePine,
} from 'lucide-react';
import { hierarchyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UnitModal from '../components/UnitModal';

export default function Dashboard() {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();

  useEffect( () => {
    const fetchHierarchy = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await hierarchyService.getHierarchy();

        // handle either {data: tree} or direct tree
        const actualData = response?.data ?? response;

        setHierarchyData(actualData || null);
      } catch (err) {
        console.error('Failed to fetch hierarchy:', err);
        setError(err.response?.data?.message || 'Failed to load hierarchy');
        setHierarchyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHierarchy(); 
  }, []);

  

  const handleCreate = async (data) => {
    try {
        await hierarchyService.createUnit(data);
        setModalOpen(false);
        fetchHierarchy();
    } catch (err) {
        console.error(err);
    }
    };

    const handleEdit = (unit) => {
        setEditingUnit(unit);
        setModalOpen(true);
    };

    const handleUpdate = async (data) => {
    try {
        await hierarchyService.updateUnit(editingUnit._id, data);
        setEditingUnit(null);
        setModalOpen(false);
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
    };

    const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
        await hierarchyService.deleteUnit(id);
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
    };

  const metrics = useMemo(() => {
    const allNodes = flattenTree(hierarchyData);
    const totalUnits = allNodes.length;
    const activeUnits = allNodes.filter((n) => n.status !== 'inactive').length;
    const childrenCount = hierarchyData?.children?.length || 0;
    const levelLabel = hierarchyData?.level || 'Unit';

    return {
      totalUnits,
      activeUnits,
      childrenCount,
      levelLabel,
    };
  }, [hierarchyData]);

  return (

    

    <div className="h-screen bg-slate-50 text-slate-900 flex overflow-hidden">

        <UnitModal
            isOpen={modalOpen}
            onClose={() => {
                setModalOpen(false);
                setEditingUnit(null);
            }}
            onSubmit={editingUnit ? handleUpdate : handleCreate}
            initialData={editingUnit}
        />

      <Sidebar onLogout={logout} user={user} onAdd={() => {
                            setEditingUnit(null);
                            setModalOpen(true);
                            }} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar onAdd={() => {
                            setEditingUnit(null);
                            setModalOpen(true);
                            }}
        />

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            <Breadcrumbs tree={hierarchyData} />

            <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                  {hierarchyData?.name || 'Hierarchy Explorer'}
                </h1>
                <p className="mt-3 text-slate-600 text-lg max-w-2xl">
                  {hierarchyData
                    ? `Monitoring hierarchical data for ${metrics.childrenCount} direct sub-units under ${hierarchyData.name}.`
                    : 'Loading hierarchy data from the server.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard label={`TOTAL ${hierarchyData?.level?.toUpperCase() || 'UNITS'}`} value={metrics.totalUnits} />
                <StatCard label="ACTIVE UNITS" value={metrics.activeUnits} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
              <HeroCard root={hierarchyData} />
              <HealthCard activeUnits={metrics.activeUnits} totalUnits={metrics.totalUnits} />
            </div>

            <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Sub-Units Ledger</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Expand the tree to inspect reporting structure.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-100 transition">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-100 transition">
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-12 bg-slate-50 py-4 px-6 text-[11px] font-bold text-slate-500 tracking-[0.22em] uppercase">
                  <div className="col-span-5">Unit Name</div>
                  <div className="col-span-2">Level</div>
                  <div className="col-span-3">Parent Unit</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {isLoading ? (
                    <div className="py-20 flex items-center justify-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Loading hierarchy...
                    </div>
                  ) : error ? (
                    <div className="py-16 text-center text-red-600 text-sm">
                      {error}
                    </div>
                  ) : hierarchyData ? (
                    <TreeTableRow unit={hierarchyData}
                                depth={0}
                                onEdit={handleEdit}
                                onDelete={handleDelete}  
                    />
                  ) : (
                    <div className="py-16 text-center text-slate-500 text-sm">
                      No hierarchical data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ onLogout, user, onAdd }) {
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

function Topbar({ onAdd }) {
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
        <button onClick={onAdd} 
                className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Add Unit
        </button>
      </div>
    </header>
  );
}

function Breadcrumbs({ tree }) {
  const trail = getBreadcrumbTrail(tree);

  if (!trail.length) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {trail.map((item, index) => (
        <React.Fragment key={item._id || item.name || index}>
          <span className={index === trail.length - 1 ? 'text-slate-900' : 'text-slate-400 uppercase tracking-widest'}>
            {item.name}
          </span>
          {index !== trail.length - 1 && <span className="text-slate-300">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 min-w-[160px]">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function HeroCard({ root }) {
  return (
    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex h-full min-h-[290px]">
        <div className="flex-1 p-8 lg:p-10">
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black tracking-[0.18em] uppercase">
            {root?.level || 'Unit'} Priority
          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-900">
            {root?.name || 'Central Operations Hub'}
          </h2>

          <p className="mt-4 text-slate-600 leading-7 max-w-xl">
            {root
              ? `The primary organizational node for ${root.name}. Use this view to inspect reporting lines, child units, and operational status at a glance.`
              : 'Hierarchy data is being loaded.'}
          </p>

          <button className="mt-8 inline-flex items-center gap-2 text-blue-700 font-bold uppercase tracking-[0.16em] text-sm">
            View Deep Analytics <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:block w-[38%] bg-gradient-to-br from-slate-50 to-slate-100 relative">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_70%_50%,_rgba(15,23,42,0.06),_transparent_35%)]" />
        </div>
      </div>
    </div>
  );
}

function HealthCard({ activeUnits, totalUnits }) {
  const compliance = totalUnits ? Math.round((activeUnits / totalUnits) * 100) : 0;

  return (
    <div className="bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-200 p-8">
      <div className="text-2xl font-black">Unit Health</div>
      <p className="mt-3 text-blue-100 leading-7">
        All child units reporting as active.
      </p>

      <div className="mt-12 flex items-end justify-between gap-6">
        <div>
          <div className="text-sm font-semibold text-blue-100">Compliance Rate</div>
          <div className="mt-3 h-2 w-48 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${compliance}%` }}
            />
          </div>
        </div>

        <div className="text-5xl font-black">{compliance}%</div>
      </div>
    </div>
  );
}

function TreeTableRow({ unit, depth, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = Array.isArray(unit.children) && unit.children.length > 0;

  const badgeClass = getBadgeClass(unit.level);

  return (
    <>
      <div
        className="grid grid-cols-12 items-center py-5 px-6 hover:bg-slate-50/80 transition cursor-pointer"
        style={{ paddingLeft: `${24 + depth * 28}px` }}
        onClick={() => hasChildren && setExpanded((v) => !v)}
      >
        <div className="col-span-5 flex items-center gap-3">
          <span className="w-5 flex items-center justify-center text-slate-400">
            {hasChildren ? (
              expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            )}
          </span>

          <div>
            <div className="font-bold text-slate-900">{unit.name}</div>
            <div className="text-xs text-slate-500 mt-1">
              {unit._id}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <span className={`inline-flex px-3 py-1 rounded-lg text-[11px] font-black tracking-[0.18em] uppercase ${badgeClass}`}>
            {unit.level}
          </span>
        </div>

        <div className="col-span-3 text-sm text-slate-600">
          {unit.parentId ? (
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              {unit.parentId}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <TreePine className="w-4 h-4 text-blue-500" />
              Root Unit
            </span>
          )}
        </div>

        <div className="col-span-2 text-right">
          <div className="flex justify-end gap-3">
            <button
                onClick={(e) => {
                e.stopPropagation();
                onEdit(unit);
                }}
                className="text-blue-600 font-semibold"
            >
                Edit
            </button>

            <button
                onClick={(e) => {
                e.stopPropagation();
                onDelete(unit._id);
                }}
                className="text-red-600 font-semibold"
            >
                Delete
            </button>
            </div>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="border-l border-slate-200 ml-10">
          {unit.children.map((child) => (
            <TreeTableRow key={child._id}
                            unit={child}
                            depth={depth + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

function getBadgeClass(level = '') {
  const key = level.toUpperCase();

  switch (key) {
    case 'ZONE':
      return 'bg-indigo-100 text-indigo-700';
    case 'RANGE':
      return 'bg-blue-100 text-blue-700';
    case 'DISTRICT':
      return 'bg-emerald-100 text-emerald-700';
    case 'CIRCLE':
      return 'bg-amber-100 text-amber-700';
    case 'STATION':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function flattenTree(node) {
  if (!node) return [];
  const result = [node];
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result.push(...flattenTree(child));
    }
  }
  return result;
}

function getBreadcrumbTrail(node) {
  if (!node) return [];
  return [node];
}