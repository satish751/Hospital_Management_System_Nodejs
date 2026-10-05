import authRoutes from "../../routes/authRoutes.js";
import { startService } from "../shared/createService.js";
import { seedReceptionist } from "./seedReceptionist.js";

startService({
  name: "auth-service",
  port: 5001,
  portEnv: "AUTH_SERVICE_PORT",
  routes: [["/api/auth", authRoutes]],
  initialize: seedReceptionist,
});
