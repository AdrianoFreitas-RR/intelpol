import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
export function DailyChart({ data, lines, height=260 }: {
  data: any[]; lines: { key: string; color: string; name?: string }[]; height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="2 4" />
          <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={50} tickFormatter={v => Intl.NumberFormat('pt-BR', { notation:'compact' }).format(v)} />
          <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', fontSize:12, borderRadius:6 }} labelStyle={{ color:'#a1a1aa' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {lines.map(l => <Line key={l.key} type="monotone" dataKey={l.key} name={l.name ?? l.key} stroke={l.color} strokeWidth={1.8} dot={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
