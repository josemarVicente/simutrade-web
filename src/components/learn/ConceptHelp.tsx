'use client';

import * as Popover from '@radix-ui/react-popover';
import { HelpCircle } from 'lucide-react';

const concepts: Record<string, { title: string; body: string }> = {
  unrealized_pnl: {
    title: 'Unrealized PnL',
    body: 'É o lucro/prejuízo “no papel”. Mostra quanto ganharia (ou perderia) se vendesse agora, mas só vira real quando você fecha a posição.',
  },
  average_buy_price: {
    title: 'Average Buy Price',
    body: 'É o preço médio pago pelas suas compras. Se você compra várias vezes, esse valor é uma média ponderada pelas quantidades.',
  },
  market_cap: {
    title: 'Market Cap',
    body: 'É o “tamanho” da empresa na bolsa: preço da ação × número total de ações em circulação. Não é o mesmo que receita ou lucro.',
  },
  drawdown: {
    title: 'Drawdown',
    body: 'É a queda do valor do portfolio a partir do pico anterior. Ajuda a entender o pior período “em baixa” que você enfrentou.',
  },
};

export default function ConceptHelp({
  conceptKey,
  className = '',
}: {
  conceptKey: keyof typeof concepts;
  className?: string;
}) {
  const c = concepts[conceptKey];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 ${className}`}
          aria-label={`Learn the concept: ${c.title}`}
        >
          <HelpCircle size={14} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-xl outline-none"
        >
          <p className="text-sm font-semibold text-zinc-100">{c.title}</p>
          <p className="mt-1 text-sm text-zinc-400">{c.body}</p>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

