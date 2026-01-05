// app.ts
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";

const app = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (_req, res) => res.send("API is running"));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

export default app; // ✅ just export the app
