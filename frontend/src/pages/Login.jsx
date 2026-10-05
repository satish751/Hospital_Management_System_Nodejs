import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Check selected role with actual backend role
      if (user.role !== role) {
        alert(`This account is registered as ${user.role}`);
        return;
      }

      // Store JWT
      localStorage.setItem("token", token);

      // Store user information
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      // Redirect based on role
      if (user.role === "patient") {
        navigate("/patient-dashboard", { replace: true });
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard", { replace: true });
      } else if (user.role === "receptionist") {
        navigate("/receptionist-dashboard", { replace: true });
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden bg-teal-600 p-12 text-white md:flex md:flex-col md:justify-center">

          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl font-bold text-teal-600">
            +
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Welcome Back to MediCare
          </h1>

          <p className="mt-5 leading-7 text-teal-50">
            Login to manage your appointments, connect with doctors,
            and access your healthcare services.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Manage your appointments</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Connect with expert doctors</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Secure healthcare management</span>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">

          <div className="mx-auto max-w-md">

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900">
              Login
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to continue to your account
            </p>

            {/* Role Selection */}
            <div className="mt-8">

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Login As
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                {/* Patient */}
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`rounded-lg border px-4 py-3 font-medium transition ${
                    role === "patient"
                      ? "border-teal-600 bg-teal-50 text-teal-600"
                      : "border-gray-200 text-gray-600 hover:border-teal-400"
                  }`}
                >
                  👤 Patient
                </button>

                {/* Doctor */}
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`rounded-lg border px-4 py-3 font-medium transition ${
                    role === "doctor"
                      ? "border-teal-600 bg-teal-50 text-teal-600"
                      : "border-gray-200 text-gray-600 hover:border-teal-400"
                  }`}
                >
                  👨‍⚕️ Doctor
                </button>

                {/* Receptionist */}
                <button
                  type="button"
                  onClick={() => setRole("receptionist")}
                  className={`rounded-lg border px-4 py-3 font-medium transition ${
                    role === "receptionist"
                      ? "border-teal-600 bg-teal-50 text-teal-600"
                      : "border-gray-200 text-gray-600 hover:border-teal-400"
                  }`}
                >
                  🧑‍💼 Receptionist
                </button>

              </div>

            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Password */}
              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot Password?
                  </button>

                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="mt-7 w-full rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700"
              >
                Login as{" "}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>

            </form>

            {/* Signup */}
            <p className="mt-6 text-center text-sm text-gray-500">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-teal-600 hover:text-teal-700"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;