import React from 'react';  
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-[#0b1f34] text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-orange-400">
          PokéTrack
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-orange-300 transition">Dashboard</Link>
          <Link to="/sets" className="hover:text-orange-300 transition">Sets</Link>
          <Link to="/cartas" className="hover:text-orange-300 transition">Cards</Link>
          <div className="relative group">
            <span className="hover:text-orange-300 transition cursor-pointer">More ▾</span>
            {/* Aquí puedes poner un dropdown si quieres más tarde */}
          </div>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1 hover:text-orange-300 transition"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">▼</span>
            </button>

            {userMenuOpen && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

  