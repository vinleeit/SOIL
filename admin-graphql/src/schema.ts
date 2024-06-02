import { buildSchema } from "graphql";

const schema = buildSchema(`
  type User {
    id: Int!
    email: String!
    username: String!
    isBlocked: Boolean!
  }

  type Product {
    id: Int!
    name: String!
    description: String!
    price: Float!
    imageURL: String!
    discountAmount: Float!
    reviews: [Review!]
  }

  type Review {
    reviewID: Int!
    rating: Int!
    review: String!
    isBlocked: Boolean!
    user: User
  }

  type Thread {
    threadID: Int!
    content: String!
    isBlocked: Boolean!
    user: User
  }

  type Query {
    users: [User!]!
    products: [Product!]!
    reviews: [Review!]!
    threads: [Thread!]!
    ReviewThread(reviewID: Int!): [Thread!]!
  }

  type Mutation {
    blockUser(id: Int!): User
    unblockUser(id: Int!): User
    addProduct(name: String!, description: String!, price: Float!, imageURL: String!, discountAmount: Float!): Product
    editProduct(id: Int!, name: String, description: String, price: Float, imageURL: String, discountAmount: Float): Product
    deleteProduct(id: Int!): Boolean
    blockReview(reviewID: Int!): Review
    blockThread(threadID: Int!): Thread
  }
`);

export { schema };
