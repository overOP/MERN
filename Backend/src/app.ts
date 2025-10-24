import * as dotenv from "dotenv";
dotenv.config();

import express, { type Application, type Request, type Response, type NextFunction } from "express";
import "./database/connection";

// Routes
import userRoutes from "./routes/auth/userRoutes";

const app: Application = express();
const port: string = process.env.PORT!;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Global Error Handler:", err);
  
  const statusCode = err.statusCode || 500;
  const message =
    err.message ||
    "Something went wrong on the server. Please try again later.";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Server
app.listen(Number(port), () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
