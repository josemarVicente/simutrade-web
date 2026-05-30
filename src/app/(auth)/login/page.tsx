'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LocaleSelector from '@/components/layout/LocaleSelector';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { useTranslation } from '@/providers/I18nProvider';
import AuthImagePanel from '@/components/layout/AuthImagePanel';

export default function LoginPage() {
  const login = useLogin();
  const toast = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form, {
      onError: (err) => {
        toast.push({
          variant: 'danger',
          title: t('auth.loginFailed'),
          description: getApiErrorMessage(err, t('auth.loginFailedDesc')),
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] grid lg:grid-cols-2">
      <AuthImagePanel />

      <div className="flex items-center justify-center px-6 py-10 relative">
        <div className="absolute right-4 top-4">
          <LocaleSelector />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{t('auth.loginTitle')}</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              {t('auth.noAccount')}{' '}
              <Link href="/register" className="text-emerald-400 hover:underline">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={login.isPending}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={login.isPending}
            />
            <Button type="submit" loading={login.isPending} className="w-full mt-2">
              {t('auth.loginButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
