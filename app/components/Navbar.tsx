'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    closeMenu();
  }, [pathname]);

  const menuItems = [
    { name: 'Beranda', href: '/', icon: '🏠' },
    { name: 'Pendaftaran', href: '/pendaftaran', icon: '📝' },
    { name: 'Informasi PPDB', href: '/informasi', icon: '📚' },
    { name: 'Jadwal', href: '/jadwal', icon: '📅' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo / School Name */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 md:w-14 md:h-14 transition-transform duration-200 group-hover:scale-105">
                <Image 
                  src="/logo-sd1.png" 
                  alt="Logo SD" 
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-gray-800 font-bold text-xl md:text-2xl">
                  PPDB Online
                </div>
                <div className="text-gray-600 text-sm md:text-base -mt-1">
                  UPT SD NEGRI 061 SUMPIRA
                </div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-3 rounded-full text-base font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-emerald-50 hover:text-blue-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Login Admin Button */}
              <Link
                href="/admin"
                className={`ml-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 border-2 ${
                  pathname.startsWith('/admin')
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <span className="text-base">👤</span>
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1'}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {menuItems.slice(0, -1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-emerald-50 hover:text-blue-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <span className="ml-auto text-white">●</span>
                    )}
                  </Link>
                ))}
                {/* Login Admin in mobile menu */}
                <Link
                  href="/admin"
                  className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-200 border-2 ${
                    isActive('/admin')
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <span className="text-xl">👤</span>
                  <span>Login Admin</span>
                  {isActive('/admin') && (
                    <span className="ml-auto text-white">●</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-18 md:h-20"></div>
    </>
  );
};

export default Navbar;

