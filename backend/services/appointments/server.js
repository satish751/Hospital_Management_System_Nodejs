import appointmentRoutes from "../../routes/appointmentRoutes.js";
import { startService } from "../shared/createService.js";

startService({
  name: "appointment-service",
  port: 5003,
  portEnv: "APPOINTMENT_SERVICE_PORT",
  routes: [["/api/appointments", appointmentRoutes]],
});
