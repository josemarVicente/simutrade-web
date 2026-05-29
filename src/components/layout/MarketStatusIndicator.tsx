'use client';

import Badge from '@/components/ui/Badge';
import { useMarketStatus } from '@/hooks/useMarket';
import { useTranslation } from '@/providers/I18nProvider';

export default function MarketStatusIndicator() {
  const { data, isLoading, isError } = useMarketStatus();
  const { t } = useTranslation();

  if (isLoading) return <Badge variant="neutral">{t('marketStatus.loading')}</Badge>;
  if (isError || !data) return <Badge variant="neutral">{t('marketStatus.unknown')}</Badge>;

  return (
    <Badge variant={data.is_open ? 'success' : 'danger'}>
      {data.is_open ? t('marketStatus.open') : t('marketStatus.closed')}
    </Badge>
  );
}
