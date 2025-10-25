import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import "./database/connection";

// Routes
import userRoutes from "./routes/auth/userRoutes";

const app: Application = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes);


// Server
app.listen(Number(port), () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
