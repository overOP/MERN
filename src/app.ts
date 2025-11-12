import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import "./database/connection";


// Routes
import userRoutes from "./routes/auth/userRoutes";
import adminSeed from "./seed/adminSeed";
import productRoutes from "./routes/admin/productRoute";
import categoryRoute from "./routes/product/categoryRoute";
import categoryController from "./controllers/product/categoryController";
import cartRoute from "./routes/cart/caryRoute";
import orderRoute from "./routes/order/orderRoute";

const app: Application = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed
adminSeed();

// Routes
app.use("/api", userRoutes);
app.use("/api/admin", productRoutes);
app.use("/api/admin", categoryRoute);
app.use("/api", cartRoute);
app.use("/api", orderRoute);


// Server
app.listen(Number(port), () => {
  categoryController.seedCategory()
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
