import { Sequelize } from "sequelize";
import { UserFactory } from "./User";
import { ReviewFactory } from "./Review";
import { ProductFactory } from "./Product";
import { ThreadFactory } from "./Thread";
import { CartItemFactory } from "./CartItem";

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
}

export const initModels = () => {
  const User = UserFactory(sequelize);
  const Review = ReviewFactory(sequelize);
  const Product = ProductFactory(sequelize);
  const Thread = ThreadFactory(sequelize);
  const CartItem = CartItemFactory(sequelize);

  // Associations
  User.hasMany(Review);
  Review.belongsTo(User);
  Review.hasMany(Thread);
  Thread.belongsTo(Review);
  Product.hasMany(Review);
  Review.belongsTo(Product);
  User.hasMany(CartItem);
  CartItem.belongsTo(User);
  Product.hasMany(CartItem);
  CartItem.belongsTo(Product);

  return {
    User,
    Review,
    Product,
    Thread,
    CartItem,
  };
};

export { sequelize };
