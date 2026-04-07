

export default function HealthCard({ activeUnits, totalUnits }) {
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