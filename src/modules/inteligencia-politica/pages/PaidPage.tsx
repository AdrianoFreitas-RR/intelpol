import { usePaid } from '../hooks/useRadar';
const fmtBRL = (n:number|null|undefined) => n==null?'—':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
export function PaidPage() {
  const { data, isLoading, error } = usePaid('30d');
  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <h2 className="text-2xl font-semibold">Pago · 30d</h2>
      {isLoading && <div className="text-zinc-500">carregando…</div>}
      {error && <div className="text-red-400">erro: {error.message}</div>}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">N ads</div><div className="text-2xl font-semibold">{data?.kpis.n_ads_total}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Spend</div><div className="text-2xl font-semibold">{fmtBRL(data?.kpis.spend_total)}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">HHI</div><div className="text-2xl font-semibold">{data?.kpis.hhi_concentration?.toFixed(2)}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Top spender</div><div className="text-lg font-semibold">{data?.kpis.top_spender}</div></div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-zinc-500 uppercase"><tr><th className="px-5 py-2 text-left">Ator</th><th className="px-3 py-2 text-right">Ads</th><th className="px-3 py-2 text-right">Spend</th><th className="px-3 py-2 text-right">Impressions</th></tr></thead>
          <tbody>{data?.ranking.map(r => (
            <tr key={r.ator_label} className="border-t border-zinc-800/50 hover:bg-zinc-800/30">
              <td className="px-5 py-2.5">{r.ator_label}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{r.n_ads}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-orange-400">{fmtBRL(r.spend_total)}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{new Intl.NumberFormat('pt-BR').format(r.imp_total)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
