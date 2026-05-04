import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, MessageSquare, DollarSign, Users, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { useDrilldown, useNews, useAgentDiagnose } from '../hooks/useRadar';
import { HBarRanking } from '../../../components/charts/HBarRanking';

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);
const fmtBRL = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => `${(n*100).toFixed(1)}%`;

const TABS = [
  { id: 'visao',      label: 'Visão Geral', icon: Activity },
  { id: 'posts',      label: 'Posts',       icon: MessageSquare },
  { id: 'paid',       label: 'Pago',        icon: DollarSign },
  { id: 'demografia', label: 'Demografia',  icon: Users },
  { id: 'discursos',  label: 'Discursos',   icon: Sparkles },
] as const;
type TabId = typeof TABS[number]['id'];

export function DrilldownPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabId>('visao');
  const { data, isLoading, error } = useDrilldown(id ?? '');
  const news = useNews({ ator_id: id, period: '30d', limit: 8 });

  if (!id) return <div className='text-zinc-500'>sem id</div>;
  if (isLoading) return <div className='text-zinc-500'>carregando…</div>;
  if (error) return <div className='text-red-400'>erro: {error.message}</div>;
  if (!data) return <div className='text-zinc-500'>sem dados</div>;

  const a = data.ator;

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <Link to='/atores' className='text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mb-2'>
            <ArrowLeft size={12} /> Atores
          </Link>
          <h2 className='text-2xl font-semibold'>{a.nome_curto ?? a.nome}</h2>
          <div className='text-sm text-zinc-500 mt-1'>
            {a.cargo_atual ?? '—'} · {a.partido_atual ?? '—'} · <span className={`${a.bloco_ideologico==='bolsonarista'?'text-red-400':a.bloco_ideologico==='centro'?'text-zinc-300':a.bloco_ideologico==='esquerda'?'text-rose-400':'text-zinc-400'}`}>{a.bloco_ideologico ?? 'não classificado'}</span>
          </div>
          <div className='flex gap-2 mt-2'>
            {a.prioridade_monitoramento === 'alta' && <span className='text-[10px] px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-900/40'>PRIORIDADE ALTA</span>}
            {a.flag_renovacao && <span className='text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400'>RENOVAÇÃO</span>}
            {a.status_eleitoral && <span className='text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400'>{a.status_eleitoral}</span>}
          </div>
        </div>
        <DiagnoseButton ator_id={id} />
      </div>

      {/* Tab nav */}
      <div className='border-b border-zinc-800 flex gap-1'>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
                active ? 'border-orange-500 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'visao' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <KPI label='Posts' value={fmt(data.tabs.visao_geral.kpis.posts)} />
            <KPI label='Engajamento' value={fmt(data.tabs.visao_geral.kpis.engagement)} accent='sky' />
            <KPI label='Likes' value={fmt(data.tabs.visao_geral.kpis.likes_total)} accent='rose' />
            <KPI label='Comments' value={fmt(data.tabs.visao_geral.kpis.comments_total)} accent='emerald' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <KPI label='Followers FB' value={fmt(a.fb_followers_snapshot)} />
            <KPI label='Followers IG' value={fmt(a.ig_followers_snapshot)} accent='violet' />
            <KPI label='Subs YT' value={fmt(a.yt_subs_snapshot)} accent='red' />
          </div>
          <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
            <div className='text-xs text-zinc-500 uppercase mb-3'>Imprensa últimos 30d</div>
            {news.isLoading && <div className='text-zinc-500 text-sm'>carregando…</div>}
            <ul className='space-y-2 text-sm'>
              {news.data?.data.map(n => (
                <li key={n.url} className='border-b border-zinc-800/40 pb-2 last:border-0'>
                  <a href={n.url} target='_blank' rel='noopener noreferrer' className='block hover:text-orange-400'>
                    {n.titulo}
                    <ExternalLink size={10} className='inline ml-1 text-zinc-600' />
                  </a>
                  <div className='text-xs text-zinc-500 mt-0.5'>{n.fonte.replace(/^gn:/,'')} · {n.data_pub ? new Date(n.data_pub).toLocaleDateString('pt-BR') : 's/d'}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'posts' && (
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
          <div className='px-5 py-3 border-b border-zinc-800 text-sm text-zinc-400'>{data.tabs.visao_geral.top_posts?.length ?? 0} posts (top engajamento)</div>
          <ul className='divide-y divide-zinc-800'>
            {data.tabs.visao_geral.top_posts?.slice(0, 30).map(p => (
              <li key={p.post_id} className='px-5 py-3 hover:bg-zinc-800/30 text-sm'>
                <div className='flex items-center gap-2 text-xs text-zinc-500 mb-1'>
                  <span className={`px-1.5 py-0.5 rounded ${p.plataforma==='facebook'?'bg-sky-950 text-sky-300':p.plataforma==='instagram'?'bg-violet-950 text-violet-300':'bg-red-950 text-red-300'}`}>{p.plataforma}</span>
                  <span>·</span><span>{p.tipo}</span>
                  {p.data_dt && <><span>·</span><span>{new Date(p.data_dt).toLocaleDateString('pt-BR')}</span></>}
                  <span className='ml-auto tabular-nums text-zinc-400'>♥ {fmt(p.likes)} · 💬 {fmt(p.comments)} · ↗ {fmt(p.shares)}</span>
                </div>
                <p className='text-zinc-300 line-clamp-2'>{p.texto ?? '<sem texto>'}</p>
                {p.link && <a href={p.link} target='_blank' rel='noopener noreferrer' className='text-xs text-orange-400/70 hover:text-orange-400'>ver no {p.plataforma}</a>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'paid' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-3 gap-4'>
            <KPI label='Ads ativos' value={fmt(data.tabs.paid.kpis.n_ads)} accent='violet' />
            <KPI label='Spend total' value={fmtBRL(data.tabs.paid.kpis.spend_total)} accent='orange' />
            <KPI label='Impressões' value={fmt(data.tabs.paid.kpis.impressions_total)} accent='sky' />
          </div>
          {data.tabs.paid.regions?.length > 0 && (
            <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
              <div className='text-xs text-zinc-500 uppercase mb-3'>Top regiões alvo de ads</div>
              <HBarRanking
                data={data.tabs.paid.regions.slice(0,8).map(r => ({ label: r.region, value: r.pct_medio }))}
                formatter={fmtPct} height={250}
              />
            </div>
          )}
        </div>
      )}

      {tab === 'demografia' && (
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
          <div className='text-xs text-zinc-500 uppercase mb-3'>Fingerprint demográfico (idade × gênero)</div>
          {data.tabs.paid.demographic_fingerprint?.length === 0 && <div className='text-zinc-500 text-sm'>sem dados demográficos disponíveis para este ator</div>}
          {data.tabs.paid.demographic_fingerprint?.length > 0 && (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='text-xs text-zinc-500 uppercase'><tr><th className='px-3 py-2 text-left'>Idade</th><th className='px-3 py-2 text-left'>Gênero</th><th className='px-3 py-2 text-right'>% médio</th><th className='px-3 py-2 text-right'>N ads</th></tr></thead>
                <tbody>{data.tabs.paid.demographic_fingerprint.map((d, i) => (
                  <tr key={i} className='border-t border-zinc-800/50'>
                    <td className='px-3 py-2'>{d.age_bucket}</td>
                    <td className='px-3 py-2'>{d.gender}</td>
                    <td className='px-3 py-2 text-right tabular-nums'>{fmtPct(d.pct_medio)}</td>
                    <td className='px-3 py-2 text-right tabular-nums text-zinc-500'>{d.n_ads}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'discursos' && (
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-500 text-sm'>
          Cluster temático (BERTopic) chega no D5. Por enquanto, use a aba <button onClick={()=>setTab('posts')} className='underline text-orange-400'>Posts</button> para ver discurso bruto.
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, accent='zinc' }: { label: string; value: string|number; accent?: 'zinc'|'orange'|'emerald'|'red'|'sky'|'violet'|'rose' }) {
  const map: Record<string, string> = { zinc:'border-zinc-800', orange:'border-orange-500/40', emerald:'border-emerald-500/40', red:'border-red-500/40', sky:'border-sky-500/40', violet:'border-violet-500/40', rose:'border-rose-500/40' };
  return (
    <div className={`bg-zinc-900 border ${map[accent]} rounded-xl p-4`}>
      <div className='text-xs text-zinc-500 uppercase'>{label}</div>
      <div className='text-2xl font-semibold tabular-nums mt-1'>{value}</div>
    </div>
  );
}

function DiagnoseButton({ ator_id }: { ator_id: string }) {
  const diag = useAgentDiagnose();
  return (
    <div className='flex flex-col items-end gap-2'>
      <button onClick={() => diag.mutate({ ator_id, period: '7d' })} disabled={diag.isPending}
        className='flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 font-medium'>
        <Sparkles size={14} /> {diag.isPending ? 'Diagnosticando…' : 'Diagnóstico IA · 7d'}
      </button>
      {diag.data && (
        <div className='max-w-md bg-zinc-900 border border-orange-500/30 rounded-xl p-4 text-sm text-zinc-200 whitespace-pre-wrap'>
          <div className='text-xs text-orange-400 mb-2'>Opus · {diag.data.usage.input_tokens}+{diag.data.usage.output_tokens} tokens</div>
          {diag.data.diagnostico}
        </div>
      )}
      {diag.error && <div className='text-xs text-red-400'>{diag.error.message}</div>}
    </div>
  );
}
