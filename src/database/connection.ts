import { Sequelize } from "sequelize-typescript";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Cart from "./models/caetModel";
import Order from "./models/orderModel";
import OrderDetail from "./models/orderDetailsModel";

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

// Relationships  

User.hasMany(Product,{foreignKey : 'userId'})
Product.belongsTo(User,{foreignKey : 'userId'})

Category.hasOne(Product,{foreignKey : 'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})

// product-cart relation 
User.hasMany(Cart,{foreignKey:'userId'})
Cart.belongsTo(User,{foreignKey : 'userId'})

// user-cart relation 
Product.hasMany(Cart,{foreignKey:'productId'})
Cart.belongsTo(Product,{foreignKey:'productId'})

// order-orderdetail relation
Order.hasMany(OrderDetail,{foreignKey:'orderId'})
OrderDetail.belongsTo(Order,{foreignKey:'orderId'})

// orderdetail-product relation 
Product.hasMany(OrderDetail,{foreignKey:'productId'})
OrderDetail.belongsTo(Product,{foreignKey:'productId'})


export default sequelize;
