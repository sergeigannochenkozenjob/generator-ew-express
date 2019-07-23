import { ApolloServer } from 'apollo-server-express';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import typeDefs from 'generators/app/templates/codebase/src/graphql/types';
import resolvers from 'generators/app/templates/codebase/src/graphql/resolvers';

const useGraphQL = (app, { dataSources = {} } = {}) => {
    const server = new ApolloServer({
        typeDefs: mergeTypes(typeDefs, { all: true }),
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

export default useGraphQL;
