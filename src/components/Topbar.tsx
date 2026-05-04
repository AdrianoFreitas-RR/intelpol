import { Sparkles } from 'lucide-react';
import { useHealth } from '../modules/inteligencia-politica/hooks/useRadar';

export function Topbar({ onAgentToggle, agentOpen }: { onAgentToggle: () => void; agentOpen: boolean }) {
  const { data: health, isLoading } = useHealth();
  const ok = health?.status === 'ok';
  return (
    <header className="h-16 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between px-6 backdrop-blur">
      <div>
        <h1 className="text-base font-semibold">Centro de Inteligência Política · Roraima</h1>
        <div className="text-xs text-zinc-500">Operação contínua · MVP 18/05 → Sprint Eleição 21/06</div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${ok ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          {isLoading ? 'API ...' : ok ? `API ok · v${health?.version}` : 'API down'}
        </div>
        <button onClick={onAgentToggle}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
            agentOpen ? 'bg-orange-500 text-zinc-950 border-orange-500' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'
          }`}>
          <Sparkles size={14} /> AgentDock
        </button>
      </div>
    </header>
  );
}
