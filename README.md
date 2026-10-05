# MediCare Hospital Management System

A React frontend backed by independently running Node.js services and a single API gateway.

## Services

| Service | Port | Owns |
| --- | ---: | --- |
| API gateway | 5000 | Frontend API entry point and service routing |
| Auth | 5001 | Signup and login; JWT issuance |
| Patient | 5002 | Patient registration/profile, patient directory, doctor directory |
| Appointment | 5003 | Patient/receptionist booking, doctor/receptionist appointment management |
| Prescription | 5004 | Doctor prescription creation and doctor/patient reads |
| Billing | 5005 | Receptionist bill creation/status and patient bill reads |

The frontend continues to call `http://localhost:5000/api`. The gateway forwards requests to the matching service. Service URLs can be overridden with `AUTH_SERVICE_URL`, `PATIENT_SERVICE_URL`, `APPOINTMENT_SERVICE_URL`, `PRESCRIPTION_SERVICE_URL`, and `BILLING_SERVICE_URL`.

## Run locally

1. Create `backend/.env` using `backend/.env.example` as a template, then set `MONGO_URI`, a private `JWT_SECRET`, and the receptionist account values.
2. Install backend dependencies with `npm install` from `backend/`.
3. Start the gateway and all services with `npm start` from `backend/`.
4. Start the frontend with `npm install` and `npm run dev` from `frontend/`.

You can also start an individual service with `npm run start:auth`, `npm run start:patients`, `npm run start:appointments`, `npm run start:prescriptions`, or `npm run start:billing`. The gateway is `npm run start:gateway`.

## Role access

- Patient: signup/login, book and view appointments, and view their prescriptions and bills.
- Doctor: signup/login, view their appointments/patients, update appointment status, create prescriptions, and view their prescriptions.
- Receptionist: login, register patients, book/manage appointments, create bills, and update bill status. The account is provisioned by the auth service from `RECEPTIONIST_EMAIL` and `RECEPTIONIST_PASSWORD`; receptionist self-signup is disabled.

All API requests pass through role-checked endpoints. Patient and doctor prescription reads are scoped to the authenticated account.

## Data storage note

Each service is a separate Express process with its own API boundary. For this project, services share the configured MongoDB database to preserve existing references between users, appointments, prescriptions, and bills. Production-grade independent service databases would require asynchronous cross-service contracts and a data migration.
