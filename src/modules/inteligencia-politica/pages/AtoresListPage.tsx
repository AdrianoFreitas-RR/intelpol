import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Star } from 'lucide-react';
import { useAtores } from '../hooks/useRadar';

const fmt = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat('pt-BR').format(n);

const BLOCO_COLORS: Record<string, string> = {
  bolsonarista:   'bg-red-950/30 text-red-300 border-red-900/40',
  centro:         'bg-zinc-800 text-zinc-300 border-zinc-700',
  esquerda:       'bg-rose-950/30 text-rose-300 border-rose-900/40',
  independente:   'bg-amber-950/30 text-amber-300 border-amber-900/40',
};

export function AtoresListPage() {
  const { data, isLoading, error } = useAtores();
  const [q, setQ] = useState('');
  const [bloco, setBloco] = useState<string>('');
  const [prioridade, setPrioridade] = useState<string>('');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.data.filter(a => {
      if (q && !((a.nome ?? '').toLowerCase().includes(q.toLowerCase()) ||
                 (a.nome_curto ?? '').toLowerCase().includes(q.toLowerCase()) ||
                 (a.partido_atual ?? '').toLowerCase().includes(q.toLowerCase()))) return false;
      if (bloco && a.bloco_ideologico !== bloco) return false;
      if (prioridade && a.prioridade_monitoramento !== prioridade) return false;
      return true;
    });
  }, [data, q, bloco, prioridade]);

  const blocos = useMemo(() => Array.from(new Set((data?.data ?? []).map(a => a.bloco_ideologico).filter(Boolean))) as string[], [data]);

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div className='flex items-end justify-between'>
        <div>
          <div className='text-xs text-zinc-500 uppercase'>Atores</div>
          <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Users size={22} /> {data?.data.length ?? 0} atores monitorados</h2>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4'>
        <div className='relative flex-1 min-w-[200px]'>
          <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500' />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Nome ou partido…'
            className='w-full bg-zinc-950 border border-zinc-700 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-500' />
        </div>
        <select value={bloco} onChange={e=>setBloco(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          <option value=''>Todos blocos</option>
          {blocos.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={prioridade} onChange={e=>setPrioridade(e.target.value)} className='bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm'>
          <option value=''>Todas prioridades</option>
          <option value='alta'>Alta</option>
          <option value='baixa'>Baixa</option>
        </select>
        {(q||bloco||prioridade) && (
          <button onClick={()=>{setQ('');setBloco('');setPrioridade('')}} className='text-xs text-zinc-500 hover:text-zinc-200 px-2'>limpar</button>
        )}
      </div>

      {/* Cards */}
      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(6)].map((_,i) => (
            <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse'>
              <div className='h-4 bg-zinc-800 rounded w-1/2 mb-3' />
              <div className='h-3 bg-zinc-800/60 rounded w-3/4 mb-2' />
              <div className='h-3 bg-zinc-800/60 rounded w-1/3' />
            </div>
          ))}
        </div>
      )}
      {error && <div className='text-red-400 text-sm'>erro: {error.message}</div>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filtered.map(a => (
          <Link key={a.ator_id} to={`/atores/${a.ator_id}`}
            className='bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500/40 hover:bg-zinc-800/40 transition group'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <div className='font-medium text-zinc-100 group-hover:text-orange-400'>{a.nome_curto ?? a.nome}</div>
                <div className='text-xs text-zinc-500 mt-0.5'>{a.cargo_atual ?? '—'}</div>
              </div>
              {a.prioridade_monitoramento === 'alta' && <Star size={14} className='text-orange-400 fill-orange-400/30' />}
            </div>
            <div className='flex flex-wrap gap-1.5 mb-3'>
              {a.partido_atual && <span className='text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300'>{a.partido_atual}</span>}
              {a.bloco_ideologico && <span className={`text-[10px] px-1.5 py-0.5 rounded border ${BLOCO_COLORS[a.bloco_ideologico] ?? 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>{a.bloco_ideologico}</span>}
              {a.flag_renovacao && <span className='text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-900/40'>RENOV</span>}
            </div>
            <div className='grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/50 text-center'>
              <div><div className='text-[10px] text-zinc-600 uppercase'>FB</div><div className='text-sm tabular-nums text-zinc-300'>{fmt(a.fb_followers_snapshot)}</div></div>
              <div><div className='text-[10px] text-zinc-600 uppercase'>IG</div><div className='text-sm tabular-nums text-zinc-300'>{fmt(a.ig_followers_snapshot)}</div></div>
              <div><div className='text-[10px] text-zinc-600 uppercase'>YT</div><div className='text-sm tabular-nums text-zinc-300'>{fmt(a.yt_subs_snapshot)}</div></div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className='text-center text-zinc-500 py-12'>Nenhum ator com os filtros aplicados.</div>
      )}
    </div>
  );
}
