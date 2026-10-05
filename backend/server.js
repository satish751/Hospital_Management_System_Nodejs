import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const services = [
  { prefix: "/api/auth", url: process.env.AUTH_SERVICE_URL || "http://localhost:5001" },
  { prefix: "/api/users", url: process.env.PATIENT_SERVICE_URL || "http://localhost:5002" },
  { prefix: "/api/patients", url: process.env.PATIENT_SERVICE_URL || "http://localhost:5002" },
  { prefix: "/api/doctors", url: process.env.PATIENT_SERVICE_URL || "http://localhost:5002" },
  { prefix: "/api/appointments", url: process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5003" },
  { prefix: "/api/prescriptions", url: process.env.PRESCRIPTION_SERVICE_URL || "http://localhost:5004" },
  { prefix: "/api/bills", url: process.env.BILLING_SERVICE_URL || "http://localhost:5005" },
];

app.get("/healthz", (req, res) => {
  res.json({ service: "api-gateway", status: "ok" });
});

app.use("/api", async (req, res) => {
  const service = services.find(({ prefix }) =>
    req.originalUrl === prefix || req.originalUrl.startsWith(`${prefix}/`)
  );

  if (!service) {
    return res.status(404).json({ message: "API route not found" });
  }

  try {
    const hasBody = !["GET", "HEAD"].includes(req.method);
    const upstream = await fetch(`${service.url}${req.originalUrl}`, {
      method: req.method,
      headers: {
        ...(req.get("authorization") && {
          authorization: req.get("authorization"),
        }),
        ...(req.get("content-type") && {
          "content-type": req.get("content-type"),
        }),
      },
      ...(hasBody && { body: JSON.stringify(req.body ?? {}) }),
    });

    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    if (contentType) {
      res.set("content-type", contentType);
    }

    return res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error("API Gateway Error:", error.message);
    return res.status(503).json({
      message: "Requested service is unavailable",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "MediCare API Gateway Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});