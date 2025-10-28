import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import "./database/connection";


// Routes
import userRoutes from "./routes/auth/userRoutes";
import adminSeed from "./seed/adminSeed";
import productRoutes from "./routes/admin/productRoute";
import categoryController from "./controllers/product/categoryController";

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


// Server
app.listen(Number(port), () => {
  categoryController.seedCategory()
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
