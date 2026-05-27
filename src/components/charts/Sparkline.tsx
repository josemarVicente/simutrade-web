'use client';

import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

export default function Sparkline({
  values,
  height = 32,
  stroke = '#c6f432',
}: {
  values: number[];
  height?: number;
  stroke?: string;
}) {
  const data = useMemo(() => {
    return values.map((v, idx) => ({ x: idx, y: v }));
  }, [values]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="y" stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

