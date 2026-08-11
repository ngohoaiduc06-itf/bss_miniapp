import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export class Shop extends Model<
  InferAttributes<Shop>,
  InferCreationAttributes<Shop>
> {
  declare id: CreationOptional<number>;

  declare shopDomain: string;

  declare shopName: string;

  declare accessToken: string;

  declare senderEmail: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Shop.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    shopDomain: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    shopName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    senderEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,

      validate: {
        isEmail: true,
      },
    },

    createdAt: {
      type: DataTypes.DATE,
    },

    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "shops",
    timestamps: true,
  },
);