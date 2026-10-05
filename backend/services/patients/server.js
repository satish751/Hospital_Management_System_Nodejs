import doctorRoutes from "../../routes/doctorRoutes.js";
import patientRoutes from "../../routes/patientRoutes.js";
import userRoutes from "../../routes/userRoutes.js";
import { startService } from "../shared/createService.js";

startService({
  name: "patient-service",
  port: 5002,
  portEnv: "PATIENT_SERVICE_PORT",
  routes: [
    ["/api/users", userRoutes],
    ["/api/doctors", doctorRoutes],
    ["/api/patients", patientRoutes],
  ],
});
