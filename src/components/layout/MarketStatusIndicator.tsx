'use client';

import Badge from '@/components/ui/Badge';
import { useMarketStatus } from '@/hooks/useMarket';

export default function MarketStatusIndicator() {
  const { data, isLoading, isError } = useMarketStatus();

  if (isLoading) return <Badge variant="neutral">Market update…</Badge>;
  if (isError || !data) return <Badge variant="neutral">Market update: n/d</Badge>;

  return (
    <Badge variant={data.is_open ? 'success' : 'danger'}>
      {data.is_open ? 'Market update: open' : 'Market update: closed'}
    </Badge>
  );
}

