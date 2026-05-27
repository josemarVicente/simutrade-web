import type { Transaction } from '@/types';

export function isBuyTransaction(type: string): boolean {
  return type.toUpperCase() === 'BUY';
}

export function getExecutionPrice(tx: Transaction): number {
  return tx.execution_price;
}
