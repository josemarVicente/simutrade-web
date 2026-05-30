'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useAuth';
import { useTranslation } from '@/providers/I18nProvider';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) return;
    if (user && !isError) router.replace('/dashboard');
    else router.replace('/login');
  }, [isLoading, isError, user, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-500 text-sm">{t('auth.checkingSession')}</div>
    </div>
  );
}
