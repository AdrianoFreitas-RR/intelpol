import { NavLink } from 'react-router-dom';
import { Activity, BarChart3, AlertTriangle, Newspaper, Users, Sparkles, ChevronLeft, ChevronRight, Radio } from 'lucide-react';

const NAV = [
  { to: '/overview',  label: 'Overview',   icon: Activity },
  { to: '/atores',    label: 'Atores',     icon: Users },
  { to: '/paid',      label: 'Pago',       icon: BarChart3 },
  { to: '/anomalias', label: 'Anomalias',  icon: AlertTriangle },
  { to: '/news',      label: 'Notícias',   icon: Newspaper },
  { to: '/agent',     label: 'AgentDock',  icon: Sparkles },
];

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside className={`${open ? 'w-60' : 'w-16'} bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-200`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
        {open && (
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-orange-400" />
            <span className="font-semibold tracking-tight">IntelPol RR</span>
          </div>
        )}
        <button onClick={onToggle} className="text-zinc-500 hover:text-zinc-200">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`
          }>
            <Icon size={18} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      {open && (
        <div className="p-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500">v0.7 MVP • RR 2026</div>
          <div className="text-xs text-zinc-600 mt-0.5">Eleição suplementar 21/06</div>
        </div>
      )}
    </aside>
  );
}
