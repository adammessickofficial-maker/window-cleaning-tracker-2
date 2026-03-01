import { money } from '@/lib/utils';

export function Money({ value }: { value: number | string }) {
  return <span>{money(value)}</span>;
}
