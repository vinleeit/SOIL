import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface ReviewAttributes {
  reviewID: number;
  rating: number;
  review: string;
  isBlocked: boolean;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "reviewID"> {}
class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  public reviewID!: number;
  public rating!: number;
  public review!: string;
  public isBlocked!: boolean;
}

export const ReviewFactory = (sequelize: Sequelize) => {
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
      review: {
        // The length of around 100 words if each word is 10 characters
        type: DataTypes.STRING(1000),
      },
      // If the review is moderated (deleted) by the admin
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Review",
    },
  );

  return Review;
};
export { Review };
