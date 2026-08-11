import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME!,
  process.env.DATABASE_USER!,
  process.env.DATABASE_PASSWORD!,
  {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 3306),
    dialect: "mysql",

    logging: false,
  },
);

export async function connectDatabase() {
  try {
    await sequelize.authenticate();

    console.log(
      "MySQL database connected successfully",
    );
  } catch (error) {
    console.error(
      "Unable to connect to MySQL:",
      error,
    );

    throw error;
  }
}