import { NavLink } from "react-router";
import { HomeOptions } from "../../Utils/HomeOptions";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
            B
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            BloodBank
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {HomeOptions.map((option) => (
            <NavLink
              key={option.label}
              to={option.href}
              className={({ isActive }) =>
                `text-base font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-[#2ECC71]"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {option.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button className="bg-[#2ECC71] hover:bg-[#27ae60] text-white font-semibold text-base px-7 py-6 rounded-full shadow-none transition-all">
            Be Our Family
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-500">
          <nav className="flex flex-col space-y-3">
            {HomeOptions.map((option) => (
              <NavLink
                key={option.label}
                to={option.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium px-2 py-1 rounded-md transition-colors ${
                    isActive
                      ? "text-[#2ECC71] bg-emerald-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {option.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-2 border-t border-gray-100">
            <Button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-white font-semibold text-base py-6 rounded-full shadow-none"
            >
              Be Our Family
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;