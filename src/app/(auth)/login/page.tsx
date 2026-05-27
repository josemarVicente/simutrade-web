'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';

export default function LoginPage() {
  const login = useLogin();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form, {
      onError: (err) => {
        toast.push({
          variant: 'danger',
          title: 'Falha no login',
          description: getApiErrorMessage(err, 'Email ou password inválidos.'),
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-400">SimuTrade</h1>
          <p className="text-zinc-500 mt-1 text-sm">Entrar na sua conta</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={login.isPending}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={login.isPending}
          />
          <Button type="submit" loading={login.isPending} className="w-full mt-2">
            Entrar
          </Button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Não tem conta?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
