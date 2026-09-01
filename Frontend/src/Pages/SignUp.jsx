// src/pages/SignUp.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import z from "zod";
import { registerUser, adminRegister }  from "../../authslice";
import { Droplet, Eye, EyeOff, ShieldCheck, User, Lock, Mail, Key, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const signupSchema = z.object({
  Name: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Invalid Email address"),
  Password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user")
});

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "user" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = (data) => {
    if (data.role === "admin") {
      dispatch(adminRegister(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-100 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-200/50 rounded-full blur-3xl -z-10" />

      <NavLink
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </NavLink>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
   
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-red-200 mb-3">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Join BloodBank</h2>
          <p className="text-sm text-gray-500 mt-1">Become a life saver today</p>
        </div>


        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${
              selectedRole === "user"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" /> Donor / User
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${
              selectedRole === "admin"
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Register Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("role")} />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.Name
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-red-600 focus:bg-white"
                }`}
                {...register("Name")}
              />
            </div>
            {errors.Name && (
              <span className="text-red-500 text-xs mt-1 block font-medium">
                {errors.Name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.emailId
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-red-600 focus:bg-white"
                }`}
                {...register("emailId")}
              />
            </div>
            {errors.emailId && (
              <span className="text-red-500 text-xs mt-1 block font-medium">
                {errors.emailId.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.Password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-red-600 focus:bg-white"
                }`}
                {...register("Password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.Password && (
              <span className="text-red-500 text-xs mt-1 block font-medium">
                {errors.Password.message}
              </span>
            )}
          </div>

          {selectedRole === "admin" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Admin Secret Key
              </label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter organization key"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.adminSecretKey
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-red-600 focus:bg-white"
                  }`}
                  {...register("adminSecretKey")}
                />
              </div>
              {errors.adminSecretKey && (
                <span className="text-red-500 text-xs mt-1 block font-medium">
                  {errors.adminSecretKey.message}
                </span>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-full font-bold text-base shadow-lg transition-all ${
              selectedRole === "admin"
                ? "bg-gray-900 hover:bg-black text-white shadow-gray-200"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
            }`}
          >
            {loading ? "Registering..." : `Create ${selectedRole === "admin" ? "Admin" : "User"} Account`}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already registered?{" "}
          <NavLink to="/login" className="text-red-600 font-bold hover:underline">
            Log In
          </NavLink>
        </div>
      </div>
    </div>
  );
}