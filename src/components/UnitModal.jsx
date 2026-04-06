import { useState, useEffect } from 'react';

export default function UnitModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: '',
    level: '',
    parentId: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: '', level: '', parentId: '' });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Unit' : 'Create Unit'}
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Unit Name"
            className="w-full border p-2 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Level (ZONE, RANGE...)"
            className="w-full border p-2 rounded-lg"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          />

          <input
            placeholder="Parent ID (optional)"
            className="w-full border p-2 rounded-lg"
            value={form.parentId}
            onChange={(e) => setForm({ ...form, parentId: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-slate-600">
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}