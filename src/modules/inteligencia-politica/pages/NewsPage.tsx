import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { useNews, useNewsStats } from '../hooks/useRadar';

const ATORES = ['antonio_denarium','edilson_damiao','teresa_surita','arthur_henrique','soldado_sampaio','romero_juca','mecias_de_jesus','hiran_goncalves','chico_rodrigues'];
const PERIODS = ['1d','3d','7d','30d','90d'];

export function NewsPage() {
  const [ator, setAtor] = useState<string>('');
  const [period, setPeriod] = useState('7d');
  const news = useNews({ ator_id: ator || undefined, period, limit: 100 });
  const stats = useNewsStats(period);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-zinc-500 uppercase">Notícias</div>
          <h2 className="text-2xl font-semibold mt-1 flex items-center gap-2">
            <Newspaper size={22} className="text-emerald-400" /> Imprensa RR · {period}
          </h2>
        </div>
        <div className="flex gap-2">
          <select value={ator} onChange={e=>setAtor(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm">
            <option value="">Todos atores</option>
            {ATORES.map(a => <option key={a} value={a}>{a.replace(/_/g,' ')}</option>)}
          </select>
          <select value={period} onChange={e=>setPeriod(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm">
            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase">Menções totais</div>
          <div className="text-2xl font-semibold tabular-nums mt-1">{stats.data?.total ?? '—'}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase">Tema mais quente</div>
          <div className="text-lg font-medium mt-1">{stats.data?.temas[0]?.tema ?? '—'} <span className="text-zinc-500">({stats.data?.temas[0]?.n ?? 0})</span></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase">Ator mais citado</div>
          <div className="text-lg font-medium mt-1">{stats.data?.atores[0]?.ator_id?.replace(/_/g,' ') ?? '—'} <span className="text-zinc-500">({stats.data?.atores[0]?.n ?? 0})</span></div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 text-sm text-zinc-400">{news.data?.total ?? 0} resultados</div>
        <ul className="divide-y divide-zinc-800">
          {news.isLoading && <li className="p-5 text-zinc-500">carregando…</li>}
          {news.data?.data.map(n => (
            <li key={n.url} className="px-5 py-3.5 hover:bg-zinc-800/30">
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                  <span className="text-emerald-400">{n.fonte.replace(/^gn:/,'')}</span>
                  {n.data_pub && <><span>·</span><span>{new Date(n.data_pub).toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' })}</span></>}
                </div>
                <div className="text-sm group-hover:text-orange-400">{n.titulo}</div>
                {n.lead && <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{n.lead.replace(/&nbsp;/g,' ').slice(0,200)}</div>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {n.atores_match.map(a => <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400">{a.replace(/_/g,' ')}</span>)}
                  {n.temas_match.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950/40 text-sky-400">{t}</span>)}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
