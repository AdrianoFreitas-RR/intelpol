import { NavLink } from 'react-router-dom';
import { Activity, BarChart3, AlertTriangle, Newspaper, Users, Sparkles, ChevronLeft, ChevronRight, Radio, Settings, MessageSquare, X } from 'lucide-react';

const NAV = [
  { to: '/overview',  label: 'Overview',   icon: Activity },
  { to: '/atores',    label: 'Atores',     icon: Users },
  { to: '/paid',      label: 'Pago',       icon: BarChart3 },
  { to: '/anomalias', label: 'Anomalias',  icon: AlertTriangle },
  { to: '/news',      label: 'Noticias',   icon: Newspaper },
  { to: '/posts',     label: 'Posts',      icon: MessageSquare },
  { to: '/agent',     label: 'AgentDock',  icon: Sparkles },
  { to: '/system',    label: 'Sistema',    icon: Settings },
];

export function Sidebar({ open, onToggle, mobileOpen, onMobileClose }: { open: boolean; onToggle: () => void; mobileOpen?: boolean; onMobileClose?: () => void }) {
  return (
    <>
      {mobileOpen && <div className='lg:hidden fixed inset-0 bg-black/60 z-40' onClick={onMobileClose} />}
      <aside className={`${open ? 'w-60' : 'w-16'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-200`}>
        <div className='h-16 flex items-center justify-between px-4 border-b border-zinc-800'>
          {open && (
            <div className='flex items-center gap-2'>
              <Radio size={18} className='text-orange-400' />
              <span className='font-semibold tracking-tight'>IntelPol RR</span>
            </div>
          )}
          <button onClick={onMobileClose} className='lg:hidden text-zinc-500 hover:text-zinc-200'><X size={18} /></button>
          <button onClick={onToggle} className='hidden lg:block text-zinc-500 hover:text-zinc-200'>
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        <nav className='flex-1 px-2 py-4 space-y-1 overflow-y-auto'>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onMobileClose} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`
            }>
              <Icon size={18} />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        {open && (
          <div className='p-4 border-t border-zinc-800 text-xs text-zinc-500'>
            v0.7 MVP - RR 2026<br/><span className='text-zinc-600'>Eleicao 21/06</span>
          </div>
        )}
      </aside>
    </>
  );
}
