import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface ReviewAttributes {
  reviewID: number;
  rating: number;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "reviewID"> {}

export const ReviewFactory = (sequelize: Sequelize) => {
  class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
    public reviewID!: number;
    public rating!: number;
  }

  Review.init(
    {
      reviewID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Review",
    },
  );

  return Review;
};
