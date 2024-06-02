import { Sequelize } from "sequelize";
import { UserFactory } from "./User";
import { ReviewFactory } from "./Review";
import { ProductFactory } from "./Product";
import { ThreadFactory } from "./Thread";
import { CartItemFactory } from "./CartItem";
import { UserFollowFactory } from "./UserFollow";

const sequelize = new Sequelize(
  "s3937118_fsd_a2",
  "s3937118_fsd_a2",
  "raveltan1234",
  {
    host: "rmit.australiaeast.cloudapp.azure.com",
    dialect: "mysql",
  },
);

export interface Models {
  User: ReturnType<typeof UserFactory>;
  Review: ReturnType<typeof ReviewFactory>;
  Product: ReturnType<typeof ProductFactory>;
  Thread: ReturnType<typeof ThreadFactory>;
  CartItem: ReturnType<typeof CartItemFactory>;
  UserFollow: ReturnType<typeof UserFollowFactory>;
}

export const initModels = () => {
  const User = UserFactory(sequelize);
  const Review = ReviewFactory(sequelize);
  const Product = ProductFactory(sequelize);
  const Thread = ThreadFactory(sequelize);
  const CartItem = CartItemFactory(sequelize);
  const UserFollow = UserFollowFactory(sequelize);

  // Associations with cascade delete and update
  User.hasMany(Review, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Review.belongsTo(User);

  User.hasMany(Thread, {
    foreignKey: "userID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Thread.belongsTo(User, { foreignKey: "userID" });

  Review.hasMany(Thread, {
    foreignKey: "reviewID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Thread.belongsTo(Review, { foreignKey: "reviewID" });

  Thread.belongsTo(Thread, {
    foreignKey: "parentThreadID",
    as: "ParentThread",
  });
  Thread.hasMany(Thread, {
    foreignKey: "parentThreadID",
    as: "ChildThreads",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Product.hasMany(Review, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Review.belongsTo(Product);

  User.hasMany(CartItem, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  CartItem.belongsTo(User);

  Product.hasMany(CartItem, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  CartItem.belongsTo(Product);

  User.hasMany(UserFollow, {
    foreignKey: "followerId",
    as: "Followers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  User.hasMany(UserFollow, {
    foreignKey: "followingId",
    as: "Following",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  UserFollow.belongsTo(User, { foreignKey: "followerId", as: "Follower" });
  UserFollow.belongsTo(User, { foreignKey: "followingId", as: "Following" });

  return {
    User,
    UserFollow,
    Review,
    Product,
    Thread,
    CartItem,
  };
};
export { sequelize };
