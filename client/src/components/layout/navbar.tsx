import { useState } from "react";
import { Link, useLocation } from "wouter";
import WalletConnect from "./wallet-connect";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-surface-800 border-b border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <i className="fas fa-fingerprint text-primary-500 text-2xl mr-2"></i>
                <span className="font-bold text-lg">DID System</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === "/" 
                      ? "text-white bg-surface-700" 
                      : "text-surface-300 hover:text-white hover:bg-surface-700"
                  } transition-colors`}
                >
                  Home
                </Link>
                <Link 
                  href="/register" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === "/register" 
                      ? "text-white bg-surface-700" 
                      : "text-surface-300 hover:text-white hover:bg-surface-700"
                  } transition-colors`}
                >
                  Register
                </Link>
                <Link 
                  href="/verify" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === "/verify" 
                      ? "text-white bg-surface-700" 
                      : "text-surface-300 hover:text-white hover:bg-surface-700"
                  } transition-colors`}
                >
                  Verify
                </Link>
              </div>
            </div>
          </div>
          <div>
            <WalletConnect />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-surface-700">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/" 
                  ? "text-white bg-surface-700" 
                  : "text-surface-300 hover:text-white hover:bg-surface-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/register" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/register" 
                  ? "text-white bg-surface-700" 
                  : "text-surface-300 hover:text-white hover:bg-surface-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
            <Link 
              href="/verify" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/verify" 
                  ? "text-white bg-surface-700" 
                  : "text-surface-300 hover:text-white hover:bg-surface-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Verify
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
