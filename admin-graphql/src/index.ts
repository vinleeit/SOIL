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
import { Sequelize } from "sequelize";
import BadWordsNext from "bad-words-next";
import en from "./en.json";

// Create new express js server instance
const app = express();
// Create new pubsub instance to refresh graphql subscribe
const pubsub = new PubSub();
// Generate new intance of badword detector based on the english dictionary
const badwords = new BadWordsNext({ data: en });
// Allows requests from all oriign
app.use(cors());
// Initialize database models
const { User, Review, Product, Thread } = initModels();

// Endpoint to perform refresh of the information
app.post("/refresh-review", async (req, res) => {
  await publishNewReview();
  await publishNewRating();
  await publishNewBestReviewed();
  return res.sendStatus(200);
});

// Get and publish newest reviews to graphql Subscription
const publishNewReview = async () => {
  // Get 3 latest reviews
  const reviews = await Review.findAll({
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
  // Inject user instance to the reivew
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
  // Publish the latest reviews to the subscriber
  setTimeout(() => {
    pubsub.publish("NEW_REVIEW", {
      newReviews: reviewsWithUser,
    });
  }, 0);
};

// Get and publish newest best reviewed items to graphql Subscription
const publishNewBestReviewed = async () => {
  // Get 3 items based on the number of review
  const result = await Product.findAll({
    attributes: [
      "id",
      "name",
      "imageURL",
      [Sequelize.fn("COUNT", Sequelize.col("Reviews.rating")), "reviewCount"],
    ],
    include: [
      {
        model: Review,
        attributes: [],
      },
    ],
    group: ["Product.id"],
    order: [[Sequelize.literal("reviewCount"), "DESC"]],
    limit: 3,
    subQuery: false,
  });
  const mapped = result.map((r) => ({
    ...r.toJSON(),
  }));

  setTimeout(() => {
    pubsub.publish("NEW_PRODUCT", {
      productMetric: mapped,
    });
  }, 0);
};

// Get and publish newest rating statistics to graphql Subscription
const publishNewRating = async () => {
  // Get the number of review for each rating (ex: 24, 5 rating items,)
  const result = await Review.findAll({
    attributes: [
      "rating",
      [Sequelize.fn("COUNT", Sequelize.col("rating")), "reviewCount"],
    ],
    group: ["rating"],
  });

  const mapped = result.map((r) => ({
    rating: r.dataValues.rating,
    //@ts-ignore
    count: r.dataValues.reviewCount,
  }));
  setTimeout(() => {
    pubsub.publish("NEW_RATING", {
      ratingMetric: mapped,
    });
  }, 0);
};

const resolvers = {
  Query: {
    // Get all users
    users: () => User.findAll(),

    // Get all products
    products: async () => {
      const products = await Product.findAll();
      const productsWithReviews = await Promise.all(
        products.map(async (product) => {
          // Find review for specific product id
          const reviews = await Review.findAll({
            //@ts-ignore
            where: { ProductId: product.id },
          });
          // Embed user to the review
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
    // Get all reviews that needs to be moderated
    reviews: async () => {
      const reviews = await Review.findAll();

      // Get reviews that is containing bad words
      const filteredReviews = reviews.filter((r) =>
        badwords.check(r.getDataValue("review")),
      );

      // Inject the user
      const reviewsWithUserAndThreads = await Promise.all(
        filteredReviews.map(async (review) => {
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

    // Get thread of a review based on review id
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

    // Get all threads that needs to be moderated
    threads: async () => {
      const threads = await Thread.findAll();
      // Get thread that only contains bad words
      const filteredThread = threads.filter((t) =>
        badwords.check(t.getDataValue("content")),
      );
      // Inject user into thread
      const threadsWithUser = await Promise.all(
        filteredThread.map(async (thread) => {
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
    // Prevent user from leaving review
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
    // Subscription to get the newest reviews that is posted on the site
    newReviews: {
      subscribe: async () => {
        await publishNewReview();
        return pubsub.asyncIterator(["NEW_REVIEW"]);
      },
    },
    // Subscription to get the most commented proudct
    productMetric: {
      subscribe: async () => {
        await publishNewBestReviewed();
        return pubsub.asyncIterator(["NEW_PRODUCT"]);
      },
    },
    // Subscription to the statistics for each of the ratings
    ratingMetric: {
      subscribe: async () => {
        await publishNewRating();
        return pubsub.asyncIterator(["NEW_RATING"]);
      },
    },
  },
};

// Create schema from resolver and gql schema
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Create apollo servre
const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  //@ts-ignore
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);

  // Server to handle graphql Subscription
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
