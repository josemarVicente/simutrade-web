'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import Button from '@/components/ui/Button';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
      {icon ? <div className="mb-3 text-zinc-500">{icon}</div> : null}
      <p className="text-sm font-medium text-zinc-200">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">{description}</p> : null}
      {action ? (
        <div className="mt-4">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center rounded-xl border border-zinc-700 bg-transparent px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              {action.label}
            </Link>
          ) : (
            <Button variant="ghost" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
