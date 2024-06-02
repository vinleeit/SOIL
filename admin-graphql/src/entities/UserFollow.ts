import { Model, DataTypes, Sequelize } from "sequelize";

class UserFollow extends Model {
  public id!: number;
  public followerId!: number;
  public followingId!: number;
}
export const UserFollowFactory = (sequelize: Sequelize) => {
  UserFollow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
