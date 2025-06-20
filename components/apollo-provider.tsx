'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';

import { makeClient } from '@/lib/apollo/config';

export default function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
