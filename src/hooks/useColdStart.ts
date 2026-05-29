import { useEffect, useState } from 'react';
import { coldStart } from '@/lib/axios';

export function useColdStart() {
  const [isWakingUp, setIsWakingUp] = useState(coldStart.isWakingUp);

  useEffect(() => {
    const unsubscribe = coldStart.subscribe(setIsWakingUp);
    return () => { unsubscribe(); };
  }, []);

  return isWakingUp;
}
