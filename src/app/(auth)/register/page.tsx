'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

const DEFAULT_BALANCE = 100_000;

export default function RegisterPage() {
  const register = useRegister();
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form, {
      onError: (err) => {
        toast.push({
          variant: 'danger',
          title: 'Falha no registo',
          description: getApiErrorMessage(err, 'Não foi possível criar a conta.'),
        });
      },
      onSuccess: () => {
        toast.push({
          variant: 'success',
          title: 'Conta criada',
          description: 'Agora pode fazer login para começar a simular trades.',
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-400">SimuTrade</h1>
          <p className="text-zinc-500 mt-1 text-sm">Criar conta de paper trading</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-200">Capital virtual</p>
              <Badge variant="neutral">default</Badge>
            </div>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{formatCurrency(DEFAULT_BALANCE)}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Definido na migration <span className="font-mono">users.balance</span> (POST /api/register não aceita
              saldo customizado).
            </p>
          </Card>
          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={register.isPending}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={register.isPending}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={register.isPending}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            required
            disabled={register.isPending}
          />
          <Button type="submit" loading={register.isPending} className="w-full mt-2">
            Criar conta
          </Button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
