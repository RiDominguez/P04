import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("username") || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-[#0d1b2a] text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          PokéTrack
        </Link>

        {/* Menú hamburguesa */}
        <div className="flex md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú navegación (desktop) */}
        <div className="space-x-8 hidden md:flex">
          <Link to="/estadisticas" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/deck" className="hover:text-gray-300">deck</Link>
          <Link to="/cartas" className="hover:text-gray-300">Cards</Link>
          <Link to="/inventario" className="hover:text-gray-300">inventory</Link>
          <Link to="/trade" className="hover:text-gray-300">Market</Link>
        </div>

        {/* Menú usuario */}
        {token ? (
          <div className="relative hidden md:block">
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
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="hover:text-gray-300">Sign in</Link>
            <Link to="/register" className="hover:text-gray-300">Create an account</Link>
          </div>
        )}
      </div>

      {/* Menú mobile desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-[#0d1b2a]">
          <Link to="/dashboard" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Dashboard</Link>
          <Link to="/sets" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Sets</Link>
          <Link to="/cartas" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Cards</Link>
          <Link to="/subir" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Upload</Link>
          {token ? (
            <button
              onClick={() => { handleLogout(); toggleMobileMenu(); }}
              className="w-full text-left text-red-500 hover:text-red-400"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Sign in</Link>
              <Link to="/register" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Create an account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
