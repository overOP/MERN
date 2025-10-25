import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  dialect: "mysql",
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  models: [__dirname + "/models"], // path to your models
});

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
  })
  .catch((err: Error) => {
    console.error("❌ Unable to connect to the database:", err);
  });

sequelize.sync({ force: false }) // true to update the database false to not
  .then(() => {
    console.log("✅ All models were synchronized successfully.");
  })
  .catch((err: Error) => {
    console.error("❌ An error occurred while synchronizing the models:", err);
  });

export default sequelize;
