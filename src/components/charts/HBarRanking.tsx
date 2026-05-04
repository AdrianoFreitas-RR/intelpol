import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
export function HBarRanking({ data, valueKey='value', labelKey='label', color='#fb923c', height=320, formatter }: {
  data: any[]; valueKey?: string; labelKey?: string; color?: string; height?: number;
  formatter?: (v: number) => string;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 70 }}>
          <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => Intl.NumberFormat('pt-BR', { notation:'compact' }).format(v)} />
          <YAxis type="category" dataKey={labelKey} stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={70} />
          <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', fontSize:12, borderRadius:6 }} formatter={(v: any) => formatter ? formatter(Number(v)) : v} />
          <Bar dataKey={valueKey} radius={[0,4,4,0]}>
            {data.map((_, i) => <Cell key={i} fill={i===0 ? '#f97316' : color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
