import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';

export const makeClient = () => {
  const isBrowser = typeof window !== 'undefined';

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: isBrowser ? '/api/graphql' : process.env.GRAPHQL_SCHEMA_URL,
    }),
  });
};
