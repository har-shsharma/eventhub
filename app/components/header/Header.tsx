'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path
      ? 'text-white font-semibold'
      : 'text-gray-300 hover:text-white transition-colors';

  const showCreate = user?.role === 'owner' || user?.role === 'admin';
  const showMyEvents = user?.role === 'owner' || user?.role === 'admin';

  return (
    <header className="w-full bg-black dark:bg-black shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-30">
      <Link href="/dashboard" className="text-2xl font-bold text-white">
        EventHub
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/dashboard" className={isActive('/dashboard')}>
          Events
        </Link>

        {user && showMyEvents && (
          <Link href="/myevents" className={isActive('/myevents')}>
            My Events
          </Link>
        )}

        {user && showCreate && (
          <Link href="/create" className={isActive('/create')}>
            Create
          </Link>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded-md text-sm transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link href="/" className={isActive('/')}>
            Login
          </Link>
        )}
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden relative">
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="space-y-1.5 focus:outline-none"
        >
          <span className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg py-2 z-50">
            <Link
              href="/dashboard"
              className={`block px-4 py-2 text-sm ${isActive('/dashboard')} cursor-pointer`}
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>

            {user && showMyEvents && (
              <Link
                href="/myevents"
                className={`block px-4 py-2 text-sm ${isActive('/myevents')} cursor-pointer`}
                onClick={() => setMenuOpen(false)}
              >
                My Events
              </Link>
            )}

            {user && showCreate && (
              <Link
                href="/create"
                className={`block px-4 py-2 text-sm ${isActive('/create')} cursor-pointer`}
                onClick={() => setMenuOpen(false)}
              >
                Create
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/"
                  className={`block px-4 py-2 text-sm ${isActive('/')} cursor-pointer`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/"
                  className={`block px-4 py-2 text-sm ${isActive('/')} cursor-pointer`}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
