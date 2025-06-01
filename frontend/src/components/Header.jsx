import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation links data
  const navLinks = [
    { path: "/trip", label: "Dashboard" },
    { path: "/report", label: "Community" },
    { path: "/line", label: "Hotel Finder" },
    { path: "/forecast", label: "Travel Forecast" },
  ];

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link (mobile)
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            PlanMyTrip
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center space-x-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative py-1 font-medium transition-colors ${
                  isActive(path)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Button */}
          {isSignedIn ? (
            <SignOutButton>
              <button className="bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition font-medium text-sm">
                Sign Out
              </button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition font-medium text-sm">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          {/* Mobile Auth Button */}
          <div className="mr-2">
            {isSignedIn ? (
              <SignOutButton>
                <button className="bg-white text-blue-600 border border-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium text-sm">
                  Sign Out
                </button>
              </SignOutButton>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-sm hover:bg-blue-700 transition font-medium text-sm">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={handleLinkClick}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    isActive(path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-500"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
