import {
  Model,
  DataTypes,
  type Optional,
  Sequelize,
  type HasManyGetAssociationsMixin,
  type HasManyAddAssociationMixin,
  type HasManyHasAssociationMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
  Association,
} from "sequelize";
import { UserFollow } from "./UserFollow";

interface UserAttributes {
  id: number;
  email: string;
  username: string;
  password: string;
  isBlocked: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isBlocked"> {}

export const UserFactory = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public email!: string;
    public username!: string;
    public password!: string;
    public isBlocked!: boolean;

    // Associations
    public readonly following?: UserFollow[];

    public getFollowing!: HasManyGetAssociationsMixin<UserFollow>;
    public addFollowing!: HasManyAddAssociationMixin<UserFollow, number>;
    public hasFollowing!: HasManyHasAssociationMixin<UserFollow, number>;
    public countFollowing!: HasManyCountAssociationsMixin;
    public createFollowing!: HasManyCreateAssociationMixin<UserFollow>;

    public static associations: {
      following: Association<User, UserFollow>;
    };
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  return User;
};
