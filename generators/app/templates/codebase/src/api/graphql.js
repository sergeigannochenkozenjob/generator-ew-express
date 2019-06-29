import { ApolloServer } from 'apollo-server-express';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import typeDefs from '../graphql/types';
import resolvers from '../graphql/resolvers';

const attachGraphQL = (app, { dataSources = {} } = {}) => {
  const server = new ApolloServer({
    typeDefs: mergeTypes(typeDefs, {all: true}),
    resolvers: mergeResolvers(resolvers),
    dataSources,
    context: () => {
      return {
        token: 'foo',
      };
    },
    debug: __DEV__,
    playground: __DEV__,
    introspective: __DEV__,
  });
  server.applyMiddleware({ app });
};

export default attachGraphQL;
