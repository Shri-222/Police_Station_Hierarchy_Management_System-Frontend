import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BadgeCheck,
  TreePine,
} from 'lucide-react';

export default function TreeTableRow({ unit, depth, onEdit, onDelete }) {
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
    case 'RANGE':
      return 'bg-indigo-100 text-indigo-700';
    case 'DISTRICT':
      return 'bg-blue-100 text-blue-700';
    case 'CIRCLE':
      return 'bg-emerald-100 text-emerald-700';
    case 'SDPO':
      return 'bg-amber-100 text-amber-700';
    case 'SP':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}