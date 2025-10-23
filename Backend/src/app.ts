import express, { type Application, type Request, type Response } from 'express';
const app: Application = express();
import * as dotenv from 'dotenv'
dotenv.config()
const port: string = process.env.PORT || '3030';

require("./model/index")

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>🚀 Server is running 🚀</h1>`);
});


app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});