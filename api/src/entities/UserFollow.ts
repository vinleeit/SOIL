// models/UserFollow.ts
import { Model, DataTypes, Sequelize } from "sequelize";

interface UserFollowAttributes {
  followerId: number;
  followingId: number;
}
class UserFollow extends Model<UserFollowAttributes> {
  public followerId!: number;
  public followingId!: number;
}

export const UserFollowFactory = (sequelize: Sequelize) => {
  UserFollow.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      followingId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UserFollow",
    },
  );

  return UserFollow;
};

export { UserFollow };
