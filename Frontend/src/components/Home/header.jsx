import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../authslice"; 
import { ShoppingCart } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { 
  Droplet, 
  LogOut, 
  ShieldCheck, 
  User as UserIcon, 
  ChevronDown 
} from "lucide-react";

export const HomeNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const userInitial = user?.Name ? user.Name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 px-4 sm:px-6 backdrop:blur-2xl ">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex-1">
          <NavLink 
            to="/" 
            className="inline-flex items-center gap-2 group hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-red-200 transition-transform group-hover:scale-105">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Blood<span className="text-red-600">Bank</span>
            </span>
          </NavLink>
        </div>
        <div className="gap-5 inline-flex items-center">
           <NavLink 
            to="/my-bookings" 
            className="inline-flex items-center gap-2 group hover:opacity-90 transition-opacity"
          >
            <ShoppingBag/>
          </NavLink>
          
        </div>

        <div className="flex-none relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-gray-200 transition-all outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm border border-red-200">
              {userInitial}
            </div>
            <span className="font-semibold text-sm text-gray-800 hidden sm:inline-block">
              {user?.Name || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible Backdrop to close on click outside */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              />

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.Name}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-gray-600">
                    Role: {user?.role || "User"}
                  </span>
                </div>

                {/* Conditional Admin Option */}
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    Admin Dashboard
                  </NavLink>
                )}

 
                <NavLink
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  My Profile
                </NavLink>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;