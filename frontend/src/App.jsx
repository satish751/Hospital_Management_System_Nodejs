import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import About from "./pages/About";
import Appointments from "./pages/Appointments";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ReceptionistWorkspace from "./pages/receptionist/ReceptionistWorkspace";
import ReceptionistBillEditor from "./pages/receptionist/ReceptionistBillEditor";
import Prescription from "./pages/Prescription";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import BillDetails from "./pages/BillDetails";
import RoleProtectedRoute from "./components/RoleProtectedRoute";


function App() {
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/appointments"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <Appointments />
            </RoleProtectedRoute>
          }
        />

        <Route path="/prescription" element={<Prescription />} />
        <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
        <Route
          path="/bills/:id"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <BillDetails />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/receptionist/bills/:appointmentId/new"
          element={
            <RoleProtectedRoute allowedRole="receptionist">
              <ReceptionistBillEditor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/receptionist/bills/:appointmentId/edit/:billId"
          element={
            <RoleProtectedRoute allowedRole="receptionist">
              <ReceptionistBillEditor />
            </RoleProtectedRoute>
          }
        />
       <Route
  path="/patient-dashboard"
  element={
    <RoleProtectedRoute allowedRole="patient">
      <PatientDashboard />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/doctor-dashboard"
  element={
    <RoleProtectedRoute allowedRole="doctor">
      <DoctorDashboard />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/receptionist-dashboard"
  element={
    <RoleProtectedRoute allowedRole="receptionist">
      <ReceptionistWorkspace />
    </RoleProtectedRoute>
  }
/>
      </Routes>
    </div>
  );
}

export default App;