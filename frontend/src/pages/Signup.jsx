import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Password length
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
      });

      console.log("Signup Response:", response.data);

      alert(
        response.data.message || "Account created successfully!"
      );

      // Go to login after successful signup
      navigate("/login");

    } catch (error) {
      console.log(
        "Signup Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 pt-28 pb-12">

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden bg-teal-600 p-12 text-white md:flex md:flex-col md:justify-center">

          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl font-bold text-teal-600">
            +
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Join MediCare Today
          </h1>

          <p className="mt-5 leading-7 text-teal-50">
            Create your account and take control of your healthcare
            journey with MediCare.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Book doctor appointments easily</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Manage your healthcare records</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Access trusted healthcare services</span>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">

          <div className="mx-auto max-w-md">

            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="mt-2 text-gray-500">
              Register to get started with MediCare
            </p>

            {/* Role */}
            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Register As
              </label>

              <div className="grid grid-cols-2 gap-3">

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

              </div>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Email */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Phone */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Password */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Confirm Password */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : `Create ${role === "patient" ? "Patient" : "Doctor"} Account`}
              </button>

            </form>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-gray-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-teal-600 hover:text-teal-700"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;