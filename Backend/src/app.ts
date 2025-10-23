import * as dotenv from "dotenv";
dotenv.config();

import express, { type Application } from "express";
import "./database/connection";

// Routes
import userRoutes from "./routes/auth/userRoutes";

const app: Application = express();

const port: string = process.env.PORT!;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);

app.listen(Number(port), () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
