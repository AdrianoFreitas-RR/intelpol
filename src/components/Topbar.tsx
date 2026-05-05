import { Sparkles, Menu, LogOut } from 'lucide-react';
import { useHealth } from '../modules/inteligencia-politica/hooks/useRadar';
import { logoutToken } from '../modules/inteligencia-politica/api/client';

export function Topbar({ onAgentToggle, agentOpen, onMobileMenu }: { onAgentToggle: () => void; agentOpen: boolean; onMobileMenu: () => void }) {
  const { data: health, isLoading } = useHealth();
  const ok = health?.status === 'ok';
  const handleLogout = () => { logoutToken(); window.location.href = '/app/login'; };
  return (
    <header className='h-16 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6 backdrop-blur'>
      <div className='flex items-center gap-3 min-w-0'>
        <button onClick={onMobileMenu} className='lg:hidden text-zinc-400 hover:text-zinc-100'><Menu size={20} /></button>
        <div className='min-w-0'>
          <h1 className='text-sm lg:text-base font-semibold truncate'>Centro de Inteligencia Politica - Roraima</h1>
          <div className='hidden sm:block text-xs text-zinc-500 truncate'>Operacao continua - MVP 18/05 -&gt; Sprint Eleicao 21/06</div>
        </div>
      </div>
      <div className='flex items-center gap-2 lg:gap-3'>
        <div className={`hidden sm:flex items-center gap-1.5 text-xs px-2 py-1 rounded ${ok ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          {isLoading ? 'API' : ok ? `API ok - v${health?.version}` : 'API down'}
        </div>
        <button onClick={onAgentToggle} className={`flex items-center gap-1.5 text-xs px-2 lg:px-3 py-1.5 rounded-lg border transition ${agentOpen ? 'bg-orange-500 text-zinc-950 border-orange-500' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}>
          <Sparkles size={14} /> <span className='hidden sm:inline'>AgentDock</span>
        </button>
        <button onClick={handleLogout} className='text-zinc-500 hover:text-zinc-200' title='Sair'><LogOut size={16} /></button>
      </div>
    </header>
  );
}
