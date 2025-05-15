'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
            >
              <Shield className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">Digital Shepherd</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Link
              href="/threats"
              className="text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Threats
            </Link>
            <Link
              href="/achievements"
              className="text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Achievements
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </>
  );
} 