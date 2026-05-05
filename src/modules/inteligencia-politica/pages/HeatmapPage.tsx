import { useFraming, useAtores } from '../hooks/useRadar';
import { Grid3x3 } from 'lucide-react';

const BLOCO_BG: Record<string,string> = {
  bolsonarista:'bg-red-900/20', centro:'bg-zinc-800/40', esquerda:'bg-rose-900/20', independente:'bg-amber-900/20'
};

export function HeatmapPage() {
  const f = useFraming(20);
  const a = useAtores();
  if (f.isLoading || a.isLoading) return <div className='text-zinc-500 p-8'>carregando...</div>;
  if (f.error || !f.data) return <div className='text-red-400 p-8'>erro framing</div>;

  // Agregar cluster x bloco
  const blocoMap = new Map((a.data?.data ?? []).map(at => [at.ator_id, at.bloco_ideologico ?? 'sem bloco']));
  const clusters = (f.data.clusters ?? []).filter(c => c.cluster_id !== 0).slice(0, 12);
  const clusterIds = clusters.map(c => c.cluster_id);
  const blocos = ['bolsonarista','centro','esquerda','independente'];

  // matriz: bloco x cluster -> n_posts
  const matrix: Record<string, Record<number, number>> = {};
  blocos.forEach(b => matrix[b] = {});
  for (const x of f.data.ator_por_cluster) {
    if (!clusterIds.includes(x.cluster_id)) continue;
    const bloco = blocoMap.get(x.ator_id) ?? '';
    if (!matrix[bloco]) continue;
    matrix[bloco][x.cluster_id] = (matrix[bloco][x.cluster_id] ?? 0) + x.n;
  }
  const maxVal = Math.max(...blocos.flatMap(b => clusterIds.map(c => matrix[b][c] ?? 0)));

  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Heatmap</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Grid3x3 size={22} /> Tema x Bloco Ideologico</h2>
      </div>
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr><th className='text-left p-2 text-zinc-500'>Cluster</th>
              {blocos.map(b => <th key={b} className={`p-2 ${BLOCO_BG[b]}`}>{b}</th>)}
            </tr>
          </thead>
          <tbody>
            {clusters.map(c => (
              <tr key={c.cluster_id} className='border-t border-zinc-800/50'>
                <td className='p-2 text-zinc-300'>{c.label.replace(/_/g,' ').slice(0,50)}</td>
                {blocos.map(b => {
                  const v = matrix[b][c.cluster_id] ?? 0;
                  const intensity = maxVal > 0 ? v / maxVal : 0;
                  const bg = `rgba(251,146,60,${intensity * 0.7})`;
                  return <td key={b} className='p-2 text-center tabular-nums' style={{ background: bg }}>{v || ''}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mt-3 text-xs text-zinc-500'>Cor mais intensa = maior volume de posts no cluster pelo bloco. Cluster genérico (#0) excluído.</div>
      </div>
    </div>
  );
}
