import { useQuery } from '@tanstack/react-query';
import { Vote, Calendar, ExternalLink } from 'lucide-react';

const BASE = import.meta.env.VITE_RADAR_API_URL || '';

function useApuracao() {
  return useQuery({
    queryKey: ['apuracao','status'],
    queryFn: async () => {
      const t = localStorage.getItem('intelpol_token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (t) headers['Authorization'] = `Bearer ${t}`;
      const r = await fetch(`${BASE}/api/apuracao/status`, { headers, credentials: 'include' });
      return r.json();
    },
  });
}
function useCalendario() {
  return useQuery({
    queryKey: ['apuracao','calendario'],
    queryFn: async () => {
      const t = localStorage.getItem('intelpol_token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (t) headers['Authorization'] = `Bearer ${t}`;
      const r = await fetch(`${BASE}/api/apuracao/calendario`, { headers, credentials: 'include' });
      return r.json();
    },
  });
}

export function ApuracaoPage() {
  const s = useApuracao();
  const c = useCalendario();
  return (
    <div className='space-y-6 max-w-[1400px] mx-auto'>
      <div>
        <div className='text-xs text-zinc-500 uppercase'>Apuracao</div>
        <h2 className='text-2xl font-semibold mt-1 flex items-center gap-2'><Vote size={22} className='text-orange-400' /> Eleicao Suplementar 21/06/2026</h2>
      </div>

      {s.data && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <KPI label='Cargo' value='Gov + Vice' />
          <KPI label='Dias para o pleito' value={String(s.data.dias_para_eleicao)} accent='orange' />
          <KPI label='Janela atual' value={s.data.janela_atual} />
          <KPI label='Mandato termina' value='05/01/2027' />
        </div>
      )}

      <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
        <h3 className='font-medium mb-3 flex items-center gap-2'><Calendar size={16} /> Proximos eventos</h3>
        <ul className='space-y-2 text-sm'>
          {(c.data?.eventos ?? []).map((e: any) => (
            <li key={e[0]} className='flex justify-between border-b border-zinc-800/40 pb-2'>
              <span className='text-zinc-300'>{e[1]}</span>
              <span className='text-zinc-500 tabular-nums'>{new Date(e[0]+'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5'>
        <h3 className='font-medium mb-3'>Apuracao em tempo real (21/06 a partir das 17h)</h3>
        <p className='text-sm text-zinc-400 mb-4'>O modulo de apuracao live (via TSE Divulgacao API) ativa automaticamente no dia da eleicao. Ate la, monitore o cenario via Overview, AgentDock e Notícias.</p>
        <a href='https://resultados.tse.jus.br/oficial/app/index.html' target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300'>
          TSE Resultados Oficial <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

function KPI({label, value, accent='zinc'}: {label:string; value:string; accent?:string}) {
  const c = accent==='orange' ? 'border-orange-500/40' : 'border-zinc-800';
  return (
    <div className={`bg-zinc-900 border ${c} rounded-xl p-4`}>
      <div className='text-xs text-zinc-500 uppercase'>{label}</div>
      <div className='text-xl font-semibold mt-1'>{value}</div>
    </div>
  );
}
