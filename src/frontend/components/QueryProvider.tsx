'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const tenantQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={tenantQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
