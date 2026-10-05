import prescriptionRoutes from "../../routes/prescriptionRoutes.js";
import { startService } from "../shared/createService.js";

startService({
  name: "prescription-service",
  port: 5004,
  portEnv: "PRESCRIPTION_SERVICE_PORT",
  routes: [["/api/prescriptions", prescriptionRoutes]],
});
