import { Model, DataTypes, Sequelize } from "sequelize";

interface CartItemAttributes {
  quantity: number;
}
class CartItem extends Model<CartItemAttributes> {
  public quantity!: number;
}

export const CartItemFactory = (sequelize: Sequelize) => {
  class CartItem extends Model<CartItemAttributes> {
    public quantity!: number;
  }

  CartItem.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
    },
  );

  return CartItem;
};
export { CartItem };
