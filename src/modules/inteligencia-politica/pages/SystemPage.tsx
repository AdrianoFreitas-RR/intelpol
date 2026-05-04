import { Activity, Clock, Webhook, Newspaper, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSystemPipeline } from '../hooks/useRadar';

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);

function relTime(iso: string | null | undefined) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `há ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h/24)}d`;
}

export function SystemPage() {
  const { data, isLoading, error } = useSystemPipeline();
  if (isLoading) return <div className='p-8 text-zinc-500'>carregando…</div>;
  if (error || !data) return <div className='p-8 text-red-400'>erro: {error?.message ?? 'sem dados'}</div>;

  const ps = data.pull_state;
  const crons = data.crons;
  const wh = data.webhooks;

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Sistema</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Activity size={22} className='text-emerald-400' /> Saúde do pipeline</h2>
        <div className='text-xs text-zinc-500 mt-1'>refresh automático 30s · snapshot {new Date(data.ts).toLocaleTimeString('pt-BR')}</div>
      </div>

      {/* KPI strip */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <KPI icon={<Activity size={16} />} label='Pull state entries' value={fmt(ps.total_entries)} sub='9 atores × 3 plats × 3 endpoints = 81 esperado' />
        <KPI icon={<Newspaper size={16} />} label='Notícias últimas 24h' value={fmt(data.news_rate.last_24h)} accent='emerald' />
        <KPI icon={<Webhook size={16} />} label='Webhook events' value={fmt(wh.total_events)} sub={`${(wh.log_size_bytes/1024).toFixed(1)} KB`} accent='violet' />
        <KPI icon={<Clock size={16} />} label='Crons configurados' value={Object.keys(crons).length} sub='full + light + news' accent='sky' />
      </div>

      {/* Cron status */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
        <div className='px-5 py-3 border-b border-zinc-800'><h3 className='font-medium text-sm flex items-center gap-2'><Clock size={14} /> Crons (last run)</h3></div>
        <table className='w-full text-sm'>
          <thead className='text-xs text-zinc-500 uppercase'><tr>
            <th className='px-5 py-2 text-left'>Job</th>
            <th className='px-3 py-2 text-left'>Última execução</th>
            <th className='px-3 py-2 text-left'>Status</th>
            <th className='px-3 py-2 text-left'>Último log</th>
          </tr></thead>
          <tbody>
            {Object.entries(crons).map(([job, info]) => {
              const ageM = info.last_run ? (Date.now() - new Date(info.last_run).getTime())/60000 : Infinity;
              const expected: Record<string, number> = { news: 15, light: 60, full: 1440 };
              const stale = ageM > (expected[job] ?? 60) * 1.5;
              return (
                <tr key={job} className='border-t border-zinc-800/50'>
                  <td className='px-5 py-2.5 font-medium'>{job}</td>
                  <td className='px-3 py-2.5 text-zinc-300'>{relTime(info.last_run)} <span className='text-zinc-600 text-xs'>({info.last_run ? new Date(info.last_run).toLocaleTimeString('pt-BR') : '—'})</span></td>
                  <td className='px-3 py-2.5'>
                    {!info.last_run ? <span className='flex items-center gap-1 text-xs text-zinc-500'><AlertCircle size={12}/> sem runs</span>
                     : stale ? <span className='flex items-center gap-1 text-xs text-amber-400'><AlertCircle size={12}/> stale</span>
                     : <span className='flex items-center gap-1 text-xs text-emerald-400'><CheckCircle2 size={12}/> OK</span>}
                  </td>
                  <td className='px-3 py-2.5 text-xs text-zinc-500 font-mono truncate max-w-[400px]'>{info.last_log_lines.slice(-1)[0] ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pull state most stale */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
        <div className='px-5 py-3 border-b border-zinc-800'><h3 className='font-medium text-sm'>Endpoints mais antigos (top 5 stale)</h3></div>
        <table className='w-full text-sm'>
          <thead className='text-xs text-zinc-500 uppercase'><tr>
            <th className='px-5 py-2 text-left'>Ator</th>
            <th className='px-3 py-2 text-left'>Plat</th>
            <th className='px-3 py-2 text-left'>Endpoint</th>
            <th className='px-3 py-2 text-left'>Último pull</th>
            <th className='px-3 py-2 text-right'>N records</th>
          </tr></thead>
          <tbody>
            {ps.most_stale?.map((r: any, i: number) => (
              <tr key={i} className='border-t border-zinc-800/50'>
                <td className='px-5 py-2.5'>{r.ator_id?.replace(/_/g,' ')}</td>
                <td className='px-3 py-2.5 text-zinc-400'>{r.plataforma}</td>
                <td className='px-3 py-2.5 text-zinc-400 font-mono text-xs'>{r.endpoint}</td>
                <td className='px-3 py-2.5'>{relTime(r.last_pull_ts)}</td>
                <td className='px-3 py-2.5 text-right tabular-nums'>{fmt(r.n_records)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Webhook events */}
      {wh.last_10.length > 0 && (
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
          <div className='px-5 py-3 border-b border-zinc-800'><h3 className='font-medium text-sm flex items-center gap-2'><Webhook size={14} /> Últimos webhook events</h3></div>
          <ul className='divide-y divide-zinc-800'>
            {wh.last_10.slice(-5).reverse().map((e, i) => (
              <li key={i} className='px-5 py-2 text-xs font-mono'>
                <span className='text-zinc-500'>{new Date(e.ts).toLocaleString('pt-BR')}</span>
                <span className='ml-2 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300'>{e.source}</span>
                <span className='ml-2 text-zinc-400 truncate'>{JSON.stringify(e).slice(0,150)}…</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KPI({ icon, label, value, sub, accent='zinc' }: { icon: React.ReactNode; label: string; value: string|number; sub?: string; accent?: 'zinc'|'orange'|'emerald'|'sky'|'violet' }) {
  const map: Record<string, string> = { zinc:'border-zinc-800', orange:'border-orange-500/40', emerald:'border-emerald-500/40', sky:'border-sky-500/40', violet:'border-violet-500/40' };
  return (
    <div className={`bg-zinc-900 border ${map[accent]} rounded-xl p-4`}>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs text-zinc-500 uppercase tracking-wide'>{label}</span>
        <span className='text-zinc-600'>{icon}</span>
      </div>
      <div className='text-2xl font-semibold tabular-nums'>{value}</div>
      {sub && <div className='text-xs text-zinc-500 mt-1'>{sub}</div>}
    </div>
  );
}
