import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <nav className="w-full fixed z-[100] border-b border-gray-100 bg-green-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-2xl font-bold text-white">
            +
          </div>

          <span className="text-2xl font-bold text-gray-800">
            Medi<span className="text-teal-600">Care</span>
          </span>
        </Link>

        {/* Menu */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="font-medium text-gray-600 hover:text-teal-600"
          >
            Home
          </Link>

          <Link
            to="/doctors"
            className="font-medium text-gray-600 hover:text-teal-600"
          >
            Doctors
          </Link>

          <Link
            to="/services"
            className="font-medium text-gray-600 hover:text-teal-600"
          >
            Services
          </Link>

          <Link
            to="/about"
            className="font-medium text-gray-600 hover:text-teal-600"
          >
            About
          </Link>

        </div>

        {/* Right Side */}
        {token ? (
          <div className="flex items-center gap-4">

            <span className="hidden font-medium text-gray-700 md:block">
              Hi, {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-teal-600 px-6 py-2.5 font-semibold text-white hover:bg-teal-700"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}

export default Navbar;