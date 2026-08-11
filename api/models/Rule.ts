import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export class Rule extends Model<
  InferAttributes<Rule>,
  InferCreationAttributes<Rule>
> {
  declare id: CreationOptional<number>;;

  declare shopId: number;

  declare name: string;

  declare status: "enable" | "disable";

  declare priority: number;

  declare applyTo: "all" | "tags";

  declare tags: string[];

  declare pricingType:
    | "fixedPrice"
    | "fixedDiscount"
    | "percentage";

  declare value: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Rule.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    shopId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "enable",
        "disable",
      ),
      allowNull: false,
      defaultValue: "enable",
    },

    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    applyTo: {
      type: DataTypes.ENUM(
        "all",
        "tags",
      ),
      allowNull: false,
      defaultValue: "all",
    },

    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    pricingType: {
      type: DataTypes.ENUM(
        "fixedPrice",
        "fixedDiscount",
        "percentage",
      ),
      allowNull: false,
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: "rules",
    timestamps: true,
  },
);