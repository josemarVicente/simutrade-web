'use client';

import { useMemo } from 'react';

export type TabItem = {
  value: string;
  label: string;
};

export default function Tabs({
  items,
  value,
  onValueChange,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const activeIndex = useMemo(() => items.findIndex((i) => i.value === value), [items, value]);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
      {items.map((item, idx) => {
        const active = idx === activeIndex;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-zinc-900 text-zinc-100'
                : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
            aria-pressed={active}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

