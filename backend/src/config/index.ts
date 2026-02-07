import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export default function middlewares(app: Express): void {
  app.use(express.json());
  app.use(cookieParser());
  console.log("Loaded MiddleWares");
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      // credentials : true   uncomment while i do next phases
    }),
  );
}
