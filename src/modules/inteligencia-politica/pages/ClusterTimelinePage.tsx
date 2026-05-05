import { useFraming } from '../hooks/useRadar';
import { Sparkles } from 'lucide-react';

export function ClusterTimelinePage() {
  const f = useFraming(15);
  if (f.isLoading) return <div className='text-zinc-500 p-8'>carregando...</div>;
  if (!f.data) return null;
  const clusters = f.data.clusters.filter(c => c.cluster_id !== 0).slice(0, 20);
  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Clusters Tematicos</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Sparkles size={22} className='text-orange-400' /> {clusters.length} clusters BERTopic</h2>
      </div>
      <ul className='space-y-3'>
        {clusters.map(c => (
          <li key={c.cluster_id} className='bg-zinc-900 border border-zinc-800 rounded-xl p-4'>
            <div className='flex items-start justify-between mb-2'>
              <div className='font-medium text-zinc-100'>{c.label.replace(/^\d+_/,'').replace(/_/g,' ').slice(0,80)}</div>
              <div className='text-orange-400 font-semibold tabular-nums'>{c.n_posts}</div>
            </div>
            <div className='text-xs text-zinc-400 font-mono'>{(c.top_keywords||'').slice(0,200)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
