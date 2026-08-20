import { useState } from "react";
import { NavLink } from "react-router";
import { HomeOptions } from "../../Utils/HomeOptions";
import { Button } from "@/components/ui/button";
import { Menu, X, Droplet } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-red-200 transition-transform group-hover:scale-105">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            Blood<span className="text-red-600">Bank</span>
          </span>
        </NavLink>

  
        <nav className="hidden md:flex items-center gap-8">
          {HomeOptions.map((option) => (
            <NavLink
              key={option.label}
              to={option.href}
              className={({ isActive }) =>
                `text-base font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-red-600 font-bold"
                    : "text-gray-600 hover:text-red-600"
                }`
              }
            >
              {option.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/login">
            <Button variant="ghost" className="text-gray-700 hover:text-red-600 hover:bg-red-50 font-semibold text-base px-5">
              Log In
            </Button>
          </NavLink>

          <NavLink to="/signup">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-6 py-6 rounded-full shadow-md shadow-red-100 transition-all hover:shadow-lg hover:shadow-red-200">
              Be Our Family
            </Button>
          </NavLink>
        </div>

 
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-red-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-2">
            {HomeOptions.map((option) => (
              <a
                key={option.label}
                to={option.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-red-600 bg-red-50 font-semibold"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`
                }
              >
                {option.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <NavLink to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-gray-200 text-gray-800 font-semibold py-5">
                Log In
              </Button>
            </NavLink>

            <NavLink to="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-5 rounded-full shadow-md">
                Be Our Family
              </Button>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;