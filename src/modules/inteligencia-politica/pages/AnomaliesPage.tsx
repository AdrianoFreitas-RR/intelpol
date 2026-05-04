import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAnomalies, useTimeseries } from '../hooks/useRadar';
import { DailyChart } from '../../../components/charts/DailyChart';

const ATOR_LABELS: Record<string, string> = {
  antonio_denarium: 'Denarium', edilson_damiao: 'Damião', teresa_surita: 'Surita',
  arthur_henrique: 'Arthur', soldado_sampaio: 'Sampaio', romero_juca: 'Jucá',
  mecias_de_jesus: 'Mecias', hiran_goncalves: 'Hiran', chico_rodrigues: 'Chico',
};

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);

export function AnomaliesPage() {
  const [period, setPeriod] = useState('30d');
  const [severity, setSeverity] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, error } = useAnomalies(period, severity || undefined);

  const rowKey = (r: any, i: number) => `${r.ator_id}|${r.plataforma}|${r.metric}|${r.data_d ?? i}`;

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div className='flex items-end justify-between'>
        <div>
          <div className='text-xs text-zinc-500 uppercase'>Anomalias</div>
          <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><AlertTriangle size={22} className='text-amber-400' /> Detecção de outliers</h2>
        </div>
        <div className='flex gap-2'>
          <select value={period} onChange={e=>setPeriod(e.target.value)} className='bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm'>
            {['7d','30d','60d','90d'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={severity} onChange={e=>setSeverity(e.target.value)} className='bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm'>
            <option value=''>Todas severidades</option>
            <option value='high'>Alta (z &gt; 3)</option>
            <option value='medium'>Média</option>
          </select>
        </div>
      </div>

      <div className='text-sm text-zinc-500'>{data?.n_total ?? 0} anomalias detectadas</div>

      {isLoading && <div className='text-zinc-500 p-8'>carregando…</div>}
      {error && <div className='text-red-400 p-8'>erro: {error.message}</div>}

      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
        <ul className='divide-y divide-zinc-800'>
          {data?.data?.slice(0, 100).map((r, i) => {
            const key = rowKey(r, i);
            const isOpen = expanded === key;
            return (
              <li key={key}>
                <button onClick={()=>setExpanded(isOpen ? null : key)}
                  className='w-full px-5 py-3 hover:bg-zinc-800/30 flex items-center gap-3 text-left'>
                  {isOpen ? <ChevronDown size={14} className='text-zinc-500'/> : <ChevronRight size={14} className='text-zinc-500'/>}
                  <span className='font-medium text-sm w-28 truncate'>{ATOR_LABELS[r.ator_id] ?? r.ator_id}</span>
                  <span className='text-xs text-zinc-500 w-20'>{r.plataforma}</span>
                  <span className='text-xs text-zinc-400 flex-1 font-mono truncate'>{r.metric}</span>
                  <span className='text-xs text-zinc-500'>{r.data_d ? new Date(r.data_d).toLocaleDateString('pt-BR') : '—'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded tabular-nums ${r.severity==='high'?'bg-red-950 text-red-300':'bg-amber-950 text-amber-300'}`}>z={r.zscore?.toFixed(1)}</span>
                </button>
                {isOpen && <AnomalyDetail row={r} />}
              </li>
            );
          })}
          {data?.data?.length === 0 && <li className='p-8 text-center text-zinc-500'>nenhuma anomalia no período</li>}
        </ul>
      </div>
    </div>
  );
}

function AnomalyDetail({ row }: { row: any }) {
  const ts = useTimeseries({ ator_id: row.ator_id, plataforma: row.plataforma, metric: row.metric, period: '60d' });

  // Filter dups por date
  const seen = new Set<string>();
  const series = (ts.data?.data ?? [])
    .filter(p => { const k = (p.date||'').slice(0,10); if (seen.has(k)) return false; seen.add(k); return true; })
    .map(p => ({ date: p.date.slice(5,10), value: p.value }));

  return (
    <div className='bg-zinc-950/40 px-5 py-4 border-t border-zinc-800/50'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='space-y-2 text-sm'>
          <div className='text-xs text-zinc-500 uppercase'>Detalhes</div>
          <div><span className='text-zinc-500'>Valor:</span> <span className='tabular-nums text-zinc-200'>{fmt(row.value)}</span></div>
          <div><span className='text-zinc-500'>Média 14d:</span> <span className='tabular-nums text-zinc-300'>{fmt(row.mean14)}</span></div>
          <div><span className='text-zinc-500'>Desvio 14d:</span> <span className='tabular-nums text-zinc-300'>{fmt(Math.round(row.std14))}</span></div>
          <div><span className='text-zinc-500'>Z-score:</span> <span className={`tabular-nums ${row.severity==='high'?'text-red-400':'text-amber-400'}`}>{row.zscore?.toFixed(2)}</span></div>
          <div><span className='text-zinc-500'>Severidade:</span> {row.severity}</div>
          <Link to={`/atores/${row.ator_id}`} className='inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-2'>
            ver perfil do ator <ExternalLink size={11} />
          </Link>
        </div>
        <div className='lg:col-span-2'>
          <div className='text-xs text-zinc-500 uppercase mb-2'>Série temporal 60d</div>
          {ts.isLoading && <div className='text-zinc-500 text-sm'>carregando…</div>}
          {ts.error && <div className='text-red-400 text-sm'>erro: {ts.error.message}</div>}
          {ts.data && series.length > 0 && (
            <DailyChart data={series} lines={[{ key: 'value', color: '#fb923c', name: row.metric }]} height={180} />
          )}
          {ts.data && series.length === 0 && <div className='text-zinc-500 text-sm'>sem pontos para esta métrica</div>}
        </div>
      </div>
    </div>
  );
}
