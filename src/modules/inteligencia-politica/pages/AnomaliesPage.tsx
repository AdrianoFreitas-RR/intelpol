import { useAnomalies } from '../hooks/useRadar';
export function AnomaliesPage() {
  const { data, isLoading, error } = useAnomalies('30d');
  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <h2 className="text-2xl font-semibold">Anomalias · 30d</h2>
      {isLoading && <div className="text-zinc-500">carregando…</div>}
      {error && <div className="text-red-400">erro: {error.message}</div>}
      <div className="text-sm text-zinc-500">{data?.n_total ?? 0} anomalias</div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-zinc-500 uppercase"><tr><th className="px-5 py-2 text-left">Ator</th><th className="px-3 py-2 text-left">Plataforma</th><th className="px-3 py-2 text-left">Métrica</th><th className="px-3 py-2 text-right">z-score</th><th className="px-3 py-2 text-left">Severidade</th></tr></thead>
          <tbody>{data?.data?.slice(0,50).map((r,i) => (
            <tr key={i} className="border-t border-zinc-800/50 hover:bg-zinc-800/30">
              <td className="px-5 py-2.5">{r.ator_id?.replace(/_/g,' ')}</td>
              <td className="px-3 py-2.5 text-zinc-400">{r.plataforma}</td>
              <td className="px-3 py-2.5">{r.metric}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{r.zscore?.toFixed(2)}</td>
              <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded ${r.severity==='high'?'bg-red-950 text-red-300':'bg-amber-950 text-amber-300'}`}>{r.severity}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
