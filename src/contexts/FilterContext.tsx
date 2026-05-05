import { createContext, useContext, useState, type ReactNode } from 'react';

export interface GlobalFilters { period: string; bloco: string; }
const STORAGE_KEY = 'intelpol_global_filters';

const FilterContext = createContext<{
  filters: GlobalFilters;
  setFilters: (f: Partial<GlobalFilters>) => void;
} | null>(null);

const DEFAULTS: GlobalFilters = { period: '30d', bloco: '' };

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setF] = useState<GlobalFilters>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULTS;
  });
  const setFilters = (patch: Partial<GlobalFilters>) => {
    const next = { ...filters, ...patch };
    setF(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };
  return <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>;
}

export function useGlobalFilters() {
  const c = useContext(FilterContext);
  if (!c) throw new Error('useGlobalFilters fora de FilterProvider');
  return c;
}
