import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  discountAmount: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public imageURL!: string;
  public discountAmount!: number;
}
export const ProductFactory = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL,
      },
      imageURL: {
        type: DataTypes.STRING,
      },
      discountAmount: {
        type: DataTypes.DECIMAL,
      },
    },
    {
      sequelize,
      modelName: "Product",
    },
  );

  return Product;
};
export { Product };
