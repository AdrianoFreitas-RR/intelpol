import { useState } from 'react';
import { useAtores, useDrilldown} from '../hooks/useRadar';
import { Users } from 'lucide-react';

const fmt = (n: number | null | undefined) => n == null ? '-' : new Intl.NumberFormat('pt-BR').format(n);
const fmtBRL = (n: number | null | undefined) => n == null ? '-' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);

function AtorCol({ ator_id }: { ator_id: string }) {
  const d = useDrilldown(ator_id, '60d');
  if (d.isLoading) return <div className='text-zinc-500 text-sm'>carregando...</div>;
  if (d.error || !d.data) return <div className='text-red-400 text-sm'>erro</div>;
  const a = d.data.ator; const k = d.data.tabs.visao_geral.kpis; const p = d.data.tabs.paid.kpis;
  return (
    <div className='space-y-3'>
      <div>
        <div className='text-lg font-semibold'>{a.nome_curto ?? a.nome}</div>
        <div className='text-xs text-zinc-500'>{a.cargo_atual} - {a.partido_atual} - {a.bloco_ideologico}</div>
      </div>
      <Row label='Posts 60d' v={fmt(k.posts)} />
      <Row label='Engajamento' v={fmt(k.engagement)} />
      <Row label='Likes total' v={fmt(k.likes_total)} />
      <Row label='Comments' v={fmt(k.comments_total)} />
      <Row label='Followers FB' v={fmt(a.fb_followers_snapshot)} />
      <Row label='Followers IG' v={fmt(a.ig_followers_snapshot)} />
      <Row label='Subs YT' v={fmt(a.yt_subs_snapshot)} />
      <Row label='Ads ativos' v={fmt(p.n_ads)} />
      <Row label='Spend' v={fmtBRL(p.spend_total)} accent='orange' />
      <Row label='Impressões' v={fmt(p.impressions_total)} />
    </div>
  );
}
function Row({label, v, accent='zinc'}:{label:string;v:string;accent?:string}) {
  const c = accent==='orange'?'text-orange-400':'text-zinc-100';
  return <div className='flex justify-between text-sm border-b border-zinc-800/50 py-1.5'><span className='text-zinc-500'>{label}</span><span className={`tabular-nums ${c}`}>{v}</span></div>;
}

export function ComparePage() {
  const atores = useAtores();
  const opts = atores.data?.data ?? [];
  const [a1, setA1] = useState('antonio_denarium');
  const [a2, setA2] = useState('soldado_sampaio');
  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Comparar</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Users size={22} /> Comparativo lado a lado</h2>
      </div>
      <div className='flex flex-wrap gap-3'>
        <select value={a1} onChange={e=>setA1(e.target.value)} className='bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm'>
          {opts.map(o => <option key={o.ator_id} value={o.ator_id}>{o.nome_curto ?? o.nome}</option>)}
        </select>
        <span className='text-zinc-600 self-center'>vs</span>
        <select value={a2} onChange={e=>setA2(e.target.value)} className='bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm'>
          {opts.map(o => <option key={o.ator_id} value={o.ator_id}>{o.nome_curto ?? o.nome}</option>)}
        </select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'><AtorCol ator_id={a1} /></div>
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'><AtorCol ator_id={a2} /></div>
      </div>
    </div>
  );
}
