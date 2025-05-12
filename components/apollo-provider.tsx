'use client';

import { makeClient } from '@/lib/apollo/config';
import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';

export default function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
