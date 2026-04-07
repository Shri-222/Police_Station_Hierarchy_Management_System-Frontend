import { useEffect, useMemo, useState } from 'react';
import { hierarchyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UnitModal from '../components/layout/UnitModal';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import StatCard from '../components/layout/StatCard';
import HeroCard from '../components/layout/HeroCard';
import HealthCard from '../components/layout/HealthCard';
import TreeTableRow from '../components/layout/TreeTableRow';
import { AlignJustify, Filter, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';


export default function Dashboard() {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { logout, user } = useAuth();

  const fetchHierarchy = async () => {
  try {
    setIsLoading(true);
    setError('');

    const response = await hierarchyService.getHierarchy();
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

  useEffect(() => {
    fetchHierarchy();
    toast.info('Welcome to the Police Station Hierarchy Management System Dashboard!');
  }, []);

  

const handleCreate = async (data) => {
  try {
    setActionLoading(true);
    await hierarchyService.createUnit(data);
    setModalOpen(false);
    await fetchHierarchy(); 
    toast.success('Unit created successfully!');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Create failed');
  }
};

    const handleEdit = (unit) => {
        setEditingUnit(unit);
        setModalOpen(true);
    };

  const handleUpdate = async (data) => {
  try {
    setActionLoading(true);
    await hierarchyService.updateUnit(editingUnit._id, data);
    setEditingUnit(null);
    setModalOpen(false);
    await fetchHierarchy(); 
    toast.update('Unit updated successfully!');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Update failed');
  }
};

  const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;

  try {
    setActionLoading(true);
    await hierarchyService.deleteUnit(id);
    await fetchHierarchy(); 
    toast.warn('Unit deleted successfully!');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Delete failed');
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
            loading={actionLoading}
        />

      <Sidebar onLogout={logout} user={user} onAdd={() => {
                            setEditingUnit(null);
                            setModalOpen(true);
                            }} 
                            loading={actionLoading}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar onAdd={() => {
                            setEditingUnit(null);
                            setModalOpen(true);
                            }}
                            loading={actionLoading}
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



function flattenTree(node) {
  if (!node) return [];
  const result = [node];
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result.push(...flattenTree(child));
    }
  }
  return  [
    node,
    ...(node.children?.flatMap(child => flattenTree(child)) || [])
  ];;
}