import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import { initModels } from "./entities";
import http from "http";
import { typeDefs } from "./schema";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import { makeExecutableSchema } from "@graphql-tools/schema";

const app = express();
app.use(cors());
const { User, Review, Product, Thread } = initModels();

const pubsub = new PubSub();

export const publishNewReview = async () => {
  const reviews = await Review.findAll({
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
  const reviewsWithUserAndThreads = await Promise.all(
    reviews.map(async (review) => {
      //@ts-ignore
      const user = await User.findOne({ where: { id: review.UserId } });
      return {
        ...review.toJSON(),
        user,
      };
    }),
  );
  // Publish the latest reviews to the subscriber
  setTimeout(() => {
    pubsub.publish("NEW_REVIEW", {
      newReviews: reviewsWithUserAndThreads,
    });
  }, 0);
};

const resolvers = {
  Query: {
    users: () => User.findAll(),
    products: async () => {
      const products = await Product.findAll();
      const productsWithReviews = await Promise.all(
        products.map(async (product) => {
          const reviews = await Review.findAll({
            //@ts-ignore
            where: { ProductId: product.id },
          });
          const reviewsWithUser = await Promise.all(
            reviews.map(async (review) => {
              //@ts-ignore
              const user = await User.findOne({ where: { id: review.UserId } });
              return {
                ...review.toJSON(),
                user,
              };
            }),
          );
          return {
            ...product.toJSON(),
            reviews: reviewsWithUser,
          };
        }),
      );
      return productsWithReviews;
    },
    reviews: async () => {
      const reviews = await Review.findAll();
      console.log(reviews);
      const reviewsWithUserAndThreads = await Promise.all(
        reviews.map(async (review) => {
          //@ts-ignore
          const user = await User.findOne({ where: { id: review.UserId } });
          return {
            ...review.toJSON(),
            user,
          };
        }),
      );
      return reviewsWithUserAndThreads;
    },
    ReviewThread: async (_: any, { reviewID }: { reviewID: number }) => {
      const threads = await Thread.findAll({ where: { reviewID } });
      const threadsWithUser = await Promise.all(
        threads.map(async (thread) => {
          const user = await User.findOne({ where: { id: thread.userID } });
          return {
            ...thread.toJSON(),
            user,
          };
        }),
      );
      return threadsWithUser;
    },
    threads: async () => {
      const threads = await Thread.findAll();
      const threadsWithUser = await Promise.all(
        threads.map(async (thread) => {
          const user = await User.findOne({ where: { id: thread.userID } }); // Update foreign key name
          return {
            ...thread.toJSON(),
            user,
          };
        }),
      );
      return threadsWithUser;
    },
  },
  Mutation: {
    blockUser: async (_: any, { id }: { id: number }) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");
      if (user.isBlocked) throw new Error("User already blocked");
      await user.update({ isBlocked: true });
      return user;
    },
    unblockUser: async (_: any, { id }: { id: number }) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");
      if (!user.isBlocked) throw new Error("User is not blocked");
      await user.update({ isBlocked: false });
      return user;
    },
    addProduct: async (
      _: any,
      {
        name,
        description,
        price,
        imageURL,
        discountAmount,
      }: {
        name: string;
        description: string;
        price: number;
        imageURL: string;
        discountAmount: number;
      },
    ) => {
      return Product.create({
        name,
        description,
        price,
        imageURL,
        discountAmount,
      });
    },
    editProduct: async (
      _: any,
      {
        id,
        name,
        description,
        price,
        imageURL,
        discountAmount,
      }: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageURL: string;
        discountAmount: number;
      },
    ) => {
      const product = await Product.findByPk(id);
      if (!product) throw new Error("Product not found");
      await product.update({
        name,
        description,
        price,
        imageURL,
        discountAmount,
      });
      return product;
    },
    deleteProduct: async (_: any, { id }: { id: number }) => {
      const product = await Product.findByPk(id);
      if (!product) throw new Error("Product not found");
      await product.destroy();
      return true;
    },
    blockReview: async (_: any, { reviewID }: { reviewID: number }) => {
      const review = await Review.findByPk(reviewID);
      if (!review) throw new Error("Review not found");
      if (review.isBlocked) throw new Error("Review already blocked");
      await review.update({ isBlocked: true });
      return review;
    },
    blockThread: async (_: any, { threadID }: { threadID: number }) => {
      const thread = await Thread.findByPk(threadID);
      if (!thread) throw new Error("Thread not found");
      if (thread.isBlocked) throw new Error("Thread already blocked");
      await thread.update({ isBlocked: true });
      return thread;
    },
  },
  Subscription: {
    newReviews: {
      subscribe: async () => {
        await publishNewReview();
        return pubsub.asyncIterator(["NEW_REVIEW"]);
      },
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  //@ts-ignore
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);

  SubscriptionServer.create(
    {
      //@ts-ignore
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    },
  );

  httpServer.listen(4000, () => {
    console.log("GraphQL server is running on port 4000");
  });
}

startServer();
