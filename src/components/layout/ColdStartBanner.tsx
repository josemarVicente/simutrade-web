'use client';

import { useColdStart } from '@/hooks/useColdStart';

export function ColdStartBanner() {
  const isWakingUp = useColdStart();

  if (!isWakingUp) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300 shadow-lg backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>
      Waking up the server, first load may take up to 60 seconds…
    </div>
  );
}
