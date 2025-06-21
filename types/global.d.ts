declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GRAPHQL_SCHEMA_URL: string;
    }
  }
}

export {};
