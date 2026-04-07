import { ArrowRight } from 'lucide-react';


export default function HeroCard({ root }) {
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