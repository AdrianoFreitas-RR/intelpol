import { useParams } from 'react-router-dom';
import { useDrilldown, useNews } from '../hooks/useRadar';

export function DrilldownPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useDrilldown(id ?? '');
  const news = useNews({ ator_id: id, period: '30d', limit: 10 });

  if (!id) return <div className="text-zinc-500">sem id</div>;
  if (isLoading) return <div className="text-zinc-500">carregando…</div>;
  if (error) return <div className="text-red-400">erro: {error.message}</div>;
  if (!data) return <div className="text-zinc-500">sem dados</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">{data.ator.nome_curto ?? data.ator.nome}</h2>
        <div className="text-sm text-zinc-500">{data.ator.cargo_atual} · {data.ator.partido_atual} · {data.ator.bloco_ideologico}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Posts</div><div className="text-2xl font-semibold tabular-nums">{data.tabs.visao_geral.kpis.posts}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Engajamento</div><div className="text-2xl font-semibold tabular-nums">{data.tabs.visao_geral.kpis.engagement}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Likes</div><div className="text-2xl font-semibold tabular-nums">{data.tabs.visao_geral.kpis.likes_total}</div></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4"><div className="text-xs text-zinc-500">Comments</div><div className="text-2xl font-semibold tabular-nums">{data.tabs.visao_geral.kpis.comments_total}</div></div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="text-xs text-zinc-500 uppercase mb-3">Imprensa 30d</div>
        <ul className="space-y-2 text-sm">
          {news.data?.data.slice(0,8).map(n => (
            <li key={n.url}><a href={n.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">{n.titulo}</a><span className="text-zinc-600 text-xs ml-2">{n.fonte.replace(/^gn:/,'')}</span></li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-zinc-500">Tabs Posts/Paid/Demografia/Discursos chegam no D3-D7.</div>
    </div>
  );
}
