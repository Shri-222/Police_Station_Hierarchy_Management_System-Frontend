import React from "react";

function getBreadcrumbTrail(node) {
  if (!node) return [];
  return [node];
}

export default function Breadcrumbs({ tree }) {
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

