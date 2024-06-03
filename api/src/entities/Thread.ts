import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface ThreadAttributes {
  threadID: number;
  content: string;
  reviewID: number;
  userID: number;
  parentThreadID?: number | null;
  isBlocked: boolean;
}

interface ThreadCreationAttributes
  extends Optional<ThreadAttributes, "threadID" | "isBlocked"> {}

class Thread extends Model<ThreadAttributes, ThreadCreationAttributes> {
  public threadID!: number;
  public content!: string;
  public reviewID!: number;
  public userID!: number;
  public parentThreadID?: number | null;
  public isBlocked!: boolean;
}

export const ThreadFactory = (sequelize: Sequelize) => {
  Thread.init(
    {
      threadID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // 100 wrods review (if each words is arround 10 letters)
      // additional check is done on the endpoint
      content: {
        type: DataTypes.STRING(1000),
      },
      // Review that this discussion is based on top of
      reviewID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // parentThreadID if the thread is a subthread
      parentThreadID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Thread,
          key: "threadID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Thread",
    },
  );

  return Thread;
};

export { Thread };
