import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "../../config/db.js";

dotenv.config();

export const startService = async ({ name, port, portEnv, routes, initialize }) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/healthz", (req, res) => {
    res.json({ service: name, status: "ok" });
  });

  routes.forEach(([path, router]) => app.use(path, router));

  await connectDB();
  await initialize?.();
  const servicePort = Number(process.env[portEnv] || port);
  app.listen(servicePort, () => {
    console.log(`${name} listening on http://localhost:${servicePort}`);
  });
};
