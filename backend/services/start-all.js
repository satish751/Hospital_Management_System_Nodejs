import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const backendDirectory = fileURLToPath(new URL("..", import.meta.url));
const serviceNames = [
  "gateway",
  "auth",
  "patients",
  "appointments",
  "prescriptions",
  "billing",
];
let shuttingDown = false;
let exitCode = 0;

const children = serviceNames.map((serviceName) => {
  const entry = serviceName === "gateway"
    ? "server.js"
    : `services/${serviceName}/server.js`;

  const child = spawn(process.execPath, [entry], {
    cwd: backendDirectory,
    env: process.env,
    stdio: "inherit",
  });

  child.once("error", (error) => {
    console.error(`Unable to start ${serviceName}:`, error.message);
    exitCode = 1;
    stopServices();
  });

  child.once("exit", (code) => {
    if (!shuttingDown) {
      exitCode = code || 1;
      stopServices();
    }
  });

  return child;
});

function stopServices() {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  children.forEach((child) => {
    if (child.exitCode === null) {
      child.kill();
    }
  });
  process.exitCode = exitCode;
}

process.on("SIGINT", stopServices);
process.on("SIGTERM", stopServices);
