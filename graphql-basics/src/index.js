import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

// demo data
const users = [
  {
    id: "1",
    name: "Subomi",
    email: "subomi@example.com"
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  }
];

const posts = [
  {
    id: "1",
    title: "Subomi's post",
    body: "bladidblablabla",
    published: true,
    author: "1"
    // comment: ["101"]
  },
  {
    id: "2",
    title: "Sarah's own",
    body: "bladidblablabla even more than the first post",
    published: true,
    author: "2"
    // comment: ["103", "104"]
  },
  {
    id: "3",
    title: "Subomi's second post",
    body: "Going to delete anyway",
    published: true,
    author: "1"
    // comment: ["102"]
  }
];

const comments = [
  { id: "101", text: "This is the first comment", author: "1", post: "1" },
  { id: "102", text: "This is the second comment", author: "1", post: "3" },
  { id: "103", text: "This is the third comment", author: "2", post: "2" },
  { id: "104", text: "This is the fourth comment", author: "2", post: "2" }
];

//Type definitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      return users;
    },

    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return (post.title || post.body).includes(args.query);
      });
    },

    comments(parents, args, ctx, info) {
      return comments;
    },

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
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => {
        user.email === args.email;
      });

      if (emailTaken) {
        throw new Error("Email Taken");
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      };
      users.push(user);

      return user;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

process.on("SIGUSR2", () => {
  process.exit(0);
});

server.start(() => {
  console.log("The server is up!");
});
