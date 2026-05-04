import { type ReactNode } from 'react';
export function KPICard({ label, value, sub, accent='zinc', icon }: {
  label: string; value: string | number; sub?: string;
  accent?: 'zinc'|'orange'|'emerald'|'red'|'sky'|'violet';
  icon?: ReactNode;
}) {
  const accentMap: Record<string, string> = {
    zinc: 'border-zinc-800', orange: 'border-orange-500/40',
    emerald: 'border-emerald-500/40', red: 'border-red-500/40',
    sky: 'border-sky-500/40', violet: 'border-violet-500/40',
  };
  return (
    <div className={`bg-zinc-900 border ${accentMap[accent]} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-zinc-600">{icon}</span>}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}
