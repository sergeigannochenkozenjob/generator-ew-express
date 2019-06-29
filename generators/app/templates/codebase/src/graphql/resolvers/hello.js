export default {
  Query: {
    hello: (parent, parameters, { dataSources }) => {
      return "Hello!";
    },
  },
};
