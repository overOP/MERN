import { Sequelize, DataTypes } from "sequelize";
import databaseConfig from "../config/dbConfig";

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.user,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
    port: databaseConfig.port,
    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      idle: databaseConfig.pool.idle,
      acquire: databaseConfig.pool.acquire,
    },
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
  })
  .catch((err: Error) => {
    console.error("❌ Unable to connect to the database:", err);
  });

const db:any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({force:true}).then(()=>{
  console.log("✅ All models were synchronized successfully.");
});

export default db;
