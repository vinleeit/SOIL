// models/User.ts
import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface UserAttributes {
  email: string;
  username: string;
  password: string;
  isBlocked: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "isBlocked"> {}

export const UserFactory = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes, UserCreationAttributes> {
    public email!: string;
    public username!: string;
    public password!: string;
    public isBlocked!: boolean;
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  return User;
};
