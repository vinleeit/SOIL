import { Model, DataTypes, type Optional, Sequelize } from "sequelize";

interface ThreadAttributes {
  threadID: number;
  rootThreadID?: number;
  parentThreadID?: number;
  content: string;
  isRemoved: boolean;
  isBlocked: boolean;
}

interface ThreadCreationAttributes
  extends Optional<
    ThreadAttributes,
    "threadID" | "rootThreadID" | "parentThreadID"
  > {}

export const ThreadFactory = (sequelize: Sequelize) => {
  class Thread extends Model<ThreadAttributes, ThreadCreationAttributes> {
    public threadID!: number;
    public rootThreadID?: number;
    public parentThreadID?: number;
    public content!: string;
    public isRemoved!: boolean;
    public isBlocked!: boolean;
  }

  Thread.init(
    {
      threadID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rootThreadID: {
        type: DataTypes.INTEGER,
      },
      parentThreadID: {
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.TEXT,
      },
      isRemoved: {
        type: DataTypes.BOOLEAN,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Thread",
    },
  );

  return Thread;
};
