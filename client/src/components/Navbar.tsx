import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("username") || "";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-[#0d1b2a] text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          PokéTrack
        </Link>

        {/* Navegación */}
        <div className="space-x-8 hidden md:flex">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/sets" className="hover:text-gray-300">Sets</Link>
          <Link to="/cartas" className="hover:text-gray-300">Cards</Link>
        </div>

        {/* Menú usuario */}
        {token ? (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:brightness-110"
            >
              {user.charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-md shadow-lg z-10">
                <div className="px-4 py-2 border-b text-sm">
                  Signed in as <span className="font-semibold">{user}</span>
                </div>
                <ul className="text-sm">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <span>🔄</span> Activity log
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <span>⚙️</span> Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                    >
                      <span>↩️</span> Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-gray-300">Sign in</Link>
            <Link to="/register" className="hover:text-gray-300">Create an account</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
