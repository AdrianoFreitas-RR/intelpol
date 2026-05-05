import { useGlobalFilters } from '../contexts/FilterContext';
const PERIODS = ['7d','30d','60d','90d'];
const BLOCOS = ['','bolsonarista','centro','esquerda','independente'];
export function GlobalFilterBar() {
  const { filters, setFilters } = useGlobalFilters();
  return (
    <div className='hidden md:flex items-center gap-2 text-xs'>
      <select value={filters.period} onChange={e => setFilters({ period: e.target.value })} className='bg-zinc-800 border border-zinc-700 rounded px-2 py-1'>
        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select value={filters.bloco} onChange={e => setFilters({ bloco: e.target.value })} className='bg-zinc-800 border border-zinc-700 rounded px-2 py-1'>
        <option value=''>Todos blocos</option>
        {BLOCOS.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  );
}
