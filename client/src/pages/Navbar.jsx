import React from "react";
import logo from "../assets/image.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md fixed w-full z-10 border-b-2 border-[#7B2D26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Raj Vedanta School" className="h-16 w-auto" />

            <div>
              <div className="text-xl font-bold text-[#7B2D26]">
                Attendance Management System
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="bg-[#7B2D26] hover:bg-[#5A1F1A] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
