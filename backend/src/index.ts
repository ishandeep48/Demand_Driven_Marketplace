import express, { Response, Request } from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB";
import middlewares from "./config/index";
import setupRoutes from "./routes/index";
import './crons/index'
dotenv.config();
const PORT = Number(process.env.PORT) || 8000;
const app = express();

async function startServer() {
  await connectDB();

  middlewares(app);

  setupRoutes(app);
  app.get("/", (req: Request, res: Response) => {
    return res.send("This is Backend , go back home");
  });
  app.listen(PORT, () => {
    console.log(`Backend Server Started at Port ${PORT}`);
  });
}

// app.get("*wildcard", (req: Request, res: Response) => {
//   return res.send("WildCard Endpoint Hit");
// });

startServer();
