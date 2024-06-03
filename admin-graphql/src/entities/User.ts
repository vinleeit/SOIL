import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  username: string;
  password: string;
  isBlocked: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isBlocked"> {}
class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public username!: string;
  public password!: string;
  public isBlocked!: boolean;
}

export const UserFactory = (sequelize: Sequelize) => {
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
      // User password hashed in bcrypt
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // If the user can leave review
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
export { User };
