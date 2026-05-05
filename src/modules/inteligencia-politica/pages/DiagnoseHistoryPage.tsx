import { useQuery } from '@tanstack/react-query';
import { Sparkles, Download } from 'lucide-react';

const BASE = import.meta.env.VITE_RADAR_API_URL || '';

function useHistory() {
  return useQuery({
    queryKey: ['diagnose-history'],
    queryFn: async () => {
      const t = localStorage.getItem('intelpol_token');
      const headers: Record<string,string> = {};
      if (t) headers['Authorization'] = `Bearer ${t}`;
      const r = await fetch(`${BASE}/api/agent/diagnose-history?limit=50`, { headers, credentials: 'include' });
      return r.json();
    },
  });
}

const exportTxt = (d: any) => {
  const blob = new Blob([`# Diagnostico IntelPol-RR\n\n**Ator:** ${d.ator_id}\n**Periodo:** ${d.period}\n**Data:** ${d.criado_em}\n\n---\n\n${d.diagnostico}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `diagnostico_${d.ator_id}_${d.period}_${d.diagnose_id.slice(0,8)}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

export function DiagnoseHistoryPage() {
  const h = useHistory();
  return (
    <div className='space-y-4 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Diagnosticos</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Sparkles size={22} className='text-orange-400' /> Historico Opus</h2>
      </div>
      {h.isLoading && <div className='text-zinc-500'>carregando...</div>}
      {!h.data?.data?.length && !h.isLoading && <div className='text-zinc-500'>nenhum diagnostico ainda. Gere um na pagina do ator (Drilldown -&gt; botao Diagnostico IA).</div>}
      <ul className='space-y-3'>
        {(h.data?.data ?? []).map((d: any) => (
          <li key={d.diagnose_id} className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
            <div className='flex items-center justify-between mb-2 text-sm'>
              <div>
                <span className='text-orange-400 font-medium'>{d.ator_id?.replace(/_/g,' ')}</span>
                <span className='text-zinc-500 ml-2'>{d.period}</span>
                <span className='text-zinc-600 ml-2 text-xs'>{new Date(d.criado_em).toLocaleString('pt-BR')}</span>
              </div>
              <button onClick={() => exportTxt(d)} className='flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100'><Download size={12} /> Markdown</button>
            </div>
            <div className='text-xs text-zinc-500 mb-2'>{d.tokens_in}+{d.tokens_out} tokens Opus</div>
            <div className='text-sm text-zinc-200 whitespace-pre-wrap line-clamp-6 hover:line-clamp-none cursor-pointer'>{d.diagnostico}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
