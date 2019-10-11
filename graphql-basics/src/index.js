import { GraphQLServer } from "graphql-yoga";

//Type definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    add(a: Float!, b: Float!): Float! 
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }

`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: "12345",
        name: "Subomi",
        email: "subomi@test.com",
        age: 26
      };
    },

    post() {
      return {
        id: "1",
        title: "First Post",
        body: "This is the first post",
        published: true
      };
    },

    add(_, args) {
      return args.a + args.b;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
