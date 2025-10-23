import express, { type Application, type Request, type Response } from 'express';
import './database/connection';
import * as dotenv from 'dotenv'
dotenv.config()
const app: Application = express();
const port: string = process.env.PORT!;

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>🚀 Server is running 🚀</h1>`);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});