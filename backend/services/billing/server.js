import billingRoutes from "../../routes/billingRoutes.js";
import { startService } from "../shared/createService.js";

startService({
  name: "billing-service",
  port: 5005,
  portEnv: "BILLING_SERVICE_PORT",
  routes: [["/api/bills", billingRoutes]],
});
