import { useState, useMemo } from 'react';
import { Search, MessageSquare, Heart, Share2, Eye, ExternalLink } from 'lucide-react';
import { usePosts, usePostsStats, useAtores } from '../hooks/useRadar';

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(n);
const fmtN = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);

const PLAT_COLORS: Record<string, string> = {
  facebook:  'bg-sky-950 text-sky-300 border-sky-900/40',
  instagram: 'bg-violet-950 text-violet-300 border-violet-900/40',
  youtube:   'bg-red-950 text-red-300 border-red-900/40',
};

const PERIODS = ['1d','7d','30d','90d'];
const SORTS = [
  { id: 'data', label: 'Mais recentes' },
  { id: 'interactions', label: 'Maior engajamento' },
  { id: 'likes', label: 'Mais curtidos' },
  { id: 'comments', label: 'Mais comentados' },
  { id: 'shares', label: 'Mais compartilhados' },
];

export function PostsPage() {
  const [period, setPeriod] = useState('7d');
  const [ator, setAtor] = useState('');
  const [plat, setPlat] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('data');

  const atores = useAtores();
  const stats = usePostsStats(period);
  const posts = usePosts({
    period, sort, limit: 100,
    ator_id: ator || undefined,
    plataforma: plat || undefined,
    q: q || undefined,
  });

  const atoresOpts = useMemo(() => (atores.data?.data ?? []).map(a => ({ id: a.ator_id, label: a.nome_curto ?? a.nome })), [atores.data]);

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div className='flex items-end justify-between'>
        <div>
          <div className='text-xs text-zinc-500 uppercase'>Posts</div>
          <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><MessageSquare size={22} className='text-sky-400' /> Feed unificado · {period}</h2>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-4'>
          <div className='text-xs text-zinc-500 uppercase'>Posts totais</div>
          <div className='text-2xl font-semibold tabular-nums mt-1'>{fmtN(stats.data?.total)}</div>
        </div>
        {stats.data?.per_plataforma.map(p => (
          <div key={p.plataforma} className='bg-zinc-900 border border-zinc-800 rounded-xl p-4'>
            <div className='text-xs text-zinc-500 uppercase'>{p.plataforma}</div>
            <div className='text-2xl font-semibold tabular-nums mt-1'>{fmtN(p.n)}</div>
            <div className='text-xs text-zinc-500'>{fmt(p.interactions_total)} interactions · {fmt(p.interactions_mean)} médias</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3'>
        <div className='relative flex-1 min-w-[200px]'>
          <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500' />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Buscar texto…'
            className='w-full bg-zinc-950 border border-zinc-700 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-sky-500' />
        </div>
        <select value={ator} onChange={e=>setAtor(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          <option value=''>Todos atores</option>
          {atoresOpts.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <select value={plat} onChange={e=>setPlat(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          <option value=''>Todas plats</option>
          <option value='facebook'>Facebook</option>
          <option value='instagram'>Instagram</option>
          <option value='youtube'>YouTube</option>
        </select>
        <select value={period} onChange={e=>setPeriod(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* Posts list */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden'>
        <div className='px-5 py-3 border-b border-zinc-800 text-sm text-zinc-400'>
          {posts.data?.total ?? 0} posts encontrados {posts.data && posts.data.total > posts.data.limit && `· mostrando ${posts.data.limit}`}
        </div>
        {posts.isLoading && <div className='p-8 text-zinc-500'>carregando…</div>}
        {posts.error && <div className='p-8 text-red-400'>erro: {posts.error.message}</div>}
        <ul className='divide-y divide-zinc-800'>
          {posts.data?.data.map(p => (
            <li key={p.post_id} className='px-5 py-4 hover:bg-zinc-800/30'>
              <div className='flex items-start gap-3'>
                {p.imagem && (
                  <img src={p.imagem} alt='' className='w-16 h-16 rounded object-cover flex-shrink-0 bg-zinc-800' loading='lazy'
                    onError={e => (e.currentTarget.style.display='none')} />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 text-xs mb-1.5 flex-wrap'>
                    <span className={`px-1.5 py-0.5 rounded border ${PLAT_COLORS[p.plataforma] ?? 'border-zinc-700'}`}>{p.plataforma}</span>
                    <span className='text-zinc-300'>{p.ator_id?.replace(/_/g,' ')}</span>
                    {p.tipo && <span className='text-zinc-500'>· {p.tipo}</span>}
                    {p.is_reel_or_short ? <span className='text-orange-400 text-[10px]'>· REEL/SHORT</span> : null}
                    {p.data_dt && <span className='text-zinc-500 ml-auto'>{new Date(p.data_dt).toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' })}</span>}
                  </div>
                  {p.texto && <p className='text-sm text-zinc-200 line-clamp-3 mb-2 whitespace-pre-wrap'>{p.texto}</p>}
                  <div className='flex items-center gap-4 text-xs text-zinc-500'>
                    <span className='flex items-center gap-1'><Heart size={12} /> {fmt(p.likes)}</span>
                    <span className='flex items-center gap-1'><MessageSquare size={12} /> {fmt(p.comments)}</span>
                    <span className='flex items-center gap-1'><Share2 size={12} /> {fmt(p.shares)}</span>
                    {p.interactions != null && <span className='text-orange-400 tabular-nums'>{fmt(p.interactions)} engagement</span>}
                    {p.video_views != null && <span className='flex items-center gap-1'><Eye size={12} /> {fmt(p.video_views)} views</span>}
                    {p.link && <a href={p.link} target='_blank' rel='noopener noreferrer' className='ml-auto hover:text-sky-400 flex items-center gap-1'>ver original <ExternalLink size={11} /></a>}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {posts.data?.data.length === 0 && <li className='p-8 text-zinc-500 text-center'>Sem posts nos filtros aplicados.</li>}
        </ul>
      </div>
    </div>
  );
}
