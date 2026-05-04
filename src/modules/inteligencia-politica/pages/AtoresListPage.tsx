import { Link } from 'react-router-dom';
import { useAtores } from '../hooks/useRadar';

export function AtoresListPage() {
  const { data, isLoading, error } = useAtores();
  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <h2 className="text-2xl font-semibold">Atores</h2>
      {isLoading && <div className="text-zinc-500">carregando…</div>}
      {error && <div className="text-red-400 text-sm">erro: {error.message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map(a => (
          <Link key={a.ator_id} to={`/atores/${a.ator_id}`}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">{a.nome_curto ?? a.nome}</div>
              {a.prioridade_monitoramento === 'alta' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400">ALTA</span>}
            </div>
            <div className="text-xs text-zinc-500">{a.cargo_atual ?? '—'} · {a.partido_atual ?? '—'}</div>
            <div className="text-xs text-zinc-600 mt-2">{a.bloco_ideologico ?? '—'}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
