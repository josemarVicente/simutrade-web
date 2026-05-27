'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usePerformance } from '@/hooks/useAnalytics';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PortfolioChart() {
  const { data, isLoading } = usePerformance(30);

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">Loading chart...</div>;
  }

  if (!data || data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
        Not enough data yet. Check back after your first trade.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDate(d)}
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#71717a', fontSize: 12 }}
          itemStyle={{ color: '#34d399' }}
          formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Portfolio value']}
          labelFormatter={(label) => formatDate(label)}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#34d399' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
