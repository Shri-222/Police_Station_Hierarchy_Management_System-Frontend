
export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 min-w-[160px]">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}