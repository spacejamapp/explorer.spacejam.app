import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { makeClient } from './config';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return makeClient();
});
