'use client';

import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

export default function Sparkline({
  values: inputValues,
  height = 32,
  stroke = '#c6f432',
}: {
  values: number[];
  height?: number;
  stroke?: string;
}) {
  const values = useMemo(() => {
    if (inputValues.length >= 2) return inputValues;
    if (inputValues.length === 1) return [inputValues[0], inputValues[0]];
    return [0, 0];
  }, [inputValues]);

  const data = useMemo(() => {
    return values.map((v, idx) => ({ x: idx, y: v }));
  }, [values]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={height}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="y" stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
