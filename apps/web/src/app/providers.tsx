import type { PropsWithChildren } from 'react';

import { seedAppData } from '@/data/seed';

seedAppData();

export function AppProviders({ children }: PropsWithChildren) {
  return <>{children}</>;
}
