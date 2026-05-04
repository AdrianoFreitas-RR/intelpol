import { LineChart, Line, ResponsiveContainer } from 'recharts';
export function Sparkline({ data, color='#fb923c' }: { data: { value: number }[]; color?: string }) {
  return (
    <div className="h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
