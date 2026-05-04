import { Link } from 'react-router-dom';
import { Users, Eye, DollarSign, Megaphone, Newspaper, AlertTriangle, ChevronRight } from 'lucide-react';
import { useOverview, useNewsStats, useNews, useAnomalies } from '../hooks/useRadar';
import { KPICard } from '../../../components/KPICard';

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);
const fmtBRL = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

const ATOR_LABELS: Record<string, string> = {
  antonio_denarium: 'Denarium', edilson_damiao: 'Damião', teresa_surita: 'Surita',
  arthur_henrique: 'Arthur', soldado_sampaio: 'Sampaio', romero_juca: 'Jucá',
  mecias_de_jesus: 'Mecias', hiran_goncalves: 'Hiran', chico_rodrigues: 'Chico',
};

const TEMA_LABELS: Record<string, string> = {
  'tse-cassacao': 'TSE / Cassação', 'governo-rr': 'Governo RR',
  'eleicao-suplementar': 'Eleição Suplementar', 'senado-rr-2026': 'Senado RR 2026',
  'ale-rr': 'ALE-RR', 'prefeitura-bv': 'Prefeitura BV',
  'federacao-pl-uniao': 'Federação PL/União/PP',
};

export function RadarOverviewPage() {
  const overview = useOverview('30d');
  const newsStats = useNewsStats('7d');
  const news = useNews({ period: '3d', limit: 10 });
  const anomalies = useAnomalies('7d');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">Overview</div>
          <h2 className="text-2xl font-semibold mt-1">Cenário político · últimos 30 dias</h2>
        </div>
        <div className="text-xs text-zinc-500">Eleição suplementar em <span className="text-orange-400">21/06</span></div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Atores monitorados" value={fmt(overview.data?.kpis.atores)} accent="zinc" icon={<Users size={16} />} />
        <KPICard label="Alcance total" value={fmt(overview.data?.kpis.alcance_total)} accent="sky" icon={<Eye size={16} />} />
        <KPICard label="Spend pago" value={fmtBRL(overview.data?.kpis.paid_total)} accent="orange" icon={<DollarSign size={16} />} />
        <KPICard label="Ads ativos" value={fmt(overview.data?.kpis.ads_janela)} accent="violet" icon={<Megaphone size={16} />} />
      </div>

      {/* Two-column: Ranking + News digest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de atores */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-medium">Ranking 30d</h3>
            <Link to="/atores" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </Link>
          </div>
          {overview.isLoading ? (
            <div className="p-8 text-zinc-500 text-sm">carregando…</div>
          ) : overview.error ? (
            <div className="p-8 text-red-400 text-sm">erro: {overview.error.message}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-zinc-500 uppercase">
                <tr><th className="px-5 py-2 text-left">Ator</th>
                  <th className="px-3 py-2 text-left">Bloco</th>
                  <th className="px-3 py-2 text-right">Followers</th>
                  <th className="px-3 py-2 text-right">Pago</th>
                  <th className="px-3 py-2 text-right">Ads</th></tr>
              </thead>
              <tbody>
                {overview.data?.ranking.slice(0, 9).map((r, i) => (
                  <tr key={r.ator_id} className={`border-t border-zinc-800/50 hover:bg-zinc-800/30 ${i===0 ? 'bg-orange-950/10':''}`}>
                    <td className="px-5 py-2.5">
                      <Link to={`/atores/${r.ator_id}`} className="hover:text-orange-400">
                        {r.nome_curto}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400 text-xs">{r.bloco_ideologico ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.followers)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-orange-400">{fmtBRL(r.paid_total)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-violet-400">{fmt(r.ads_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* News stats compact */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2"><Newspaper size={16} className="text-emerald-400" /> Imprensa 7d</h3>
            <Link to="/news" className="text-xs text-zinc-500 hover:text-zinc-300">ver feed</Link>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-xs text-zinc-500 uppercase">Total menções</div>
            <div className="text-3xl font-semibold tabular-nums">{fmt(newsStats.data?.total)}</div>
            <div>
              <div className="text-xs text-zinc-500 uppercase mb-2">Top atores</div>
              <div className="space-y-1.5">
                {newsStats.data?.atores.slice(0, 5).map(a => (
                  <div key={a.ator_id} className="flex justify-between text-sm">
                    <Link to={`/atores/${a.ator_id}`} className="hover:text-orange-400">{ATOR_LABELS[a.ator_id] ?? a.ator_id}</Link>
                    <span className="text-zinc-500 tabular-nums">{a.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase mb-2">Top temas</div>
              <div className="space-y-1.5">
                {newsStats.data?.temas.slice(0, 4).map(t => (
                  <div key={t.tema} className="flex justify-between text-sm">
                    <span className="text-zinc-300">{TEMA_LABELS[t.tema] ?? t.tema}</span>
                    <span className="text-zinc-500 tabular-nums">{t.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News headlines + Anomalias side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h3 className="font-medium">Últimas manchetes (3d)</h3>
          </div>
          <ul className="divide-y divide-zinc-800">
            {news.isLoading && <li className="p-5 text-zinc-500 text-sm">carregando…</li>}
            {news.data?.data.slice(0, 6).map(n => (
              <li key={n.url} className="px-5 py-3 hover:bg-zinc-800/30">
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <span>{n.fonte.replace(/^gn:/,'GoogleNews ')}</span>
                    {n.data_pub && <span>·</span>}
                    {n.data_pub && <span>{new Date(n.data_pub).toLocaleDateString('pt-BR')}</span>}
                  </div>
                  <div className="text-sm line-clamp-2 hover:text-orange-400">{n.titulo}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {n.atores_match.slice(0,3).map(a => (
                      <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-900/40">{ATOR_LABELS[a] ?? a}</span>
                    ))}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h3 className="font-medium flex items-center gap-2"><AlertTriangle size={16} className="text-red-400" /> Anomalias 7d</h3>
          </div>
          <ul className="divide-y divide-zinc-800">
            {anomalies.isLoading && <li className="p-5 text-zinc-500 text-sm">carregando…</li>}
            {anomalies.data?.data?.slice(0, 8).map((a, i) => (
              <li key={i} className="px-5 py-2.5 hover:bg-zinc-800/30 text-sm">
                <div className="flex justify-between">
                  <span><Link to={`/atores/${a.ator_id}`} className="hover:text-orange-400">{ATOR_LABELS[a.ator_id] ?? a.ator_id}</Link>
                    <span className="text-zinc-500"> · {a.metric} {a.plataforma}</span></span>
                  <span className={`text-xs ${a.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>z={a.zscore?.toFixed(1)}</span>
                </div>
              </li>
            )) ?? <li className="p-5 text-zinc-500 text-sm">sem anomalias detectadas</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
