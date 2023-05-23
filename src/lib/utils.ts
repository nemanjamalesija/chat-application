import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();

  return sortedIds.join('--');
}
