
import {
  MapPin,
  Activity,
  Calendar,
  Edit3,
  Save,
  X,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Check,
  ShieldCheck,
  HeartPulse,
  Droplets,
  Phone,
  UserRound,
  Stethoscope,
  Navigation,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../Utils/axiosclient";
import {
  fetchMedicalInfo,
  fetchPendingBookings,
} from "../../authslice";
import HomeNavbar from "@/components/Home/header";

const MyProfile = () => {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  // -----------------------------
  // Profile state
  // -----------------------------
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // -----------------------------
  // Booking state
  // -----------------------------
  const [pendingBookings, setPendingBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  // -----------------------------
  // Medical state
  // -----------------------------
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [medicalLoading, setMedicalLoading] = useState(false);
  const [medicalError, setMedicalError] = useState(null);
  const [isEditingMedical, setIsEditingMedical] = useState(false);

  // -----------------------------
  // Location state
  // -----------------------------
  const [location, setLocation] = useState({
    address: "",
    loading: false,
    error: null,
  });

  // -----------------------------
  // Medical form
  // -----------------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bloodGroup: "",
      age: "",
      allergies: "",
      chronicDiseases: "",
      emergencyContact: "",
    },
  });

  // -----------------------------
  // Sync user
  // -----------------------------
  useEffect(() => {
    if (user) {
      setUserName(user.Name || user.name || "");
    }
  }, [user]);

  // -----------------------------
  // Load medical details
  // -----------------------------
  useEffect(() => {
    const loadMedicalDetails = async () => {
      setMedicalLoading(true);
      setMedicalError(null);

      try {
        const response = await axiosClient.get("/medical-info");

        const data =
          response.data?.data ||
          response.data ||
          null;

        if (data) {
          setMedicalInfo(data);

          reset({
            bloodGroup: data.bloodGroup || "",
            age: data.age || "",
            allergies: data.allergies || "",
            chronicDiseases: data.chronicDiseases || "",
            emergencyContact: data.emergencyContact || "",
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setMedicalError(
            err.response?.data?.message ||
              "Unable to load medical information."
          );
        }
      } finally {
        setMedicalLoading(false);
      }
    };

    loadMedicalDetails();
    dispatch(fetchMedicalInfo());
  }, [dispatch, reset]);

  // -----------------------------
  // Load bookings
  // -----------------------------
  useEffect(() => {
    const loadBookings = async () => {
      setBookingsLoading(true);
      setBookingsError(null);

      try {
        const response = await axiosClient.get("/item/my-bookings");

        const allBookings =
          response.data?.data ||
          response.data?.bookings ||
          response.data ||
          [];

        const pendingOnly = allBookings.filter(
          (booking) =>
            booking.status?.toLowerCase() === "pending"
        );

        setPendingBookings(pendingOnly);
      } catch (err) {
        setBookingsError(
          err.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookings();
    dispatch(fetchPendingBookings());
  }, [dispatch]);

  // -----------------------------
  // Location
  // -----------------------------
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Location services are not supported.",
      }));
      return;
    }

    setLocation({
      address: "",
      loading: true,
      error: null,
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setLocation({
            address:
              data.display_name ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            loading: false,
            error: null,
          });
        } catch {
          setLocation({
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            loading: false,
            error: null,
          });
        }
      },
      () => {
        setLocation({
          address: "",
          loading: false,
          error: "Location permission was not granted.",
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // -----------------------------
  // Update name
  // -----------------------------
  const handleNameSubmit = async (event) => {
    event.preventDefault();

    if (!userName.trim()) return;

    setNameLoading(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      const emailId = user?.emailId || user?.email;

      await axiosClient.post("/updatename", {
        Name: userName.trim(),
        emailId,
      });

      setIsEditingName(false);
      setNameSuccess(true);

      setTimeout(() => {
        setNameSuccess(false);
      }, 3000);
    } catch (err) {
      setNameError(
        err.response?.data?.message ||
          "Unable to update your name."
      );
    } finally {
      setNameLoading(false);
    }
  };

  // -----------------------------
  // Save medical information
  // -----------------------------
  const onMedicalSubmit = async (formData) => {
    setMedicalError(null);

    try {
      const response = await axiosClient.post(
        "/medical-info",
        formData
      );

      const updated =
        response.data?.data ||
        formData;

      setMedicalInfo(updated);
      reset(updated);
      setIsEditingMedical(false);
    } catch (err) {
      setMedicalError(
        err.response?.data?.message ||
          "Unable to save medical information."
      );
    }
  };

  const initials =
    (userName || "P")
      .trim()
      .charAt(0)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <HomeNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* --------------------------------
            Page heading
        -------------------------------- */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <UserRound size={16} />
            <span>Patient Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">
              My Profile
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                My Profile
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your personal and medical information securely.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 w-fit">
              <ShieldCheck size={14} />
              Secure patient record
            </div>
          </div>
        </div>

        {/* --------------------------------
            Patient identity card
        -------------------------------- */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          <div className="h-2 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500" />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              <div className="flex items-center gap-4 min-w-0">

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl sm:text-3xl font-semibold text-blue-700">
                    {initials}
                  </span>
                </div>

                <div className="min-w-0">
                  {!isEditingName ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 truncate">
                        {userName || "Patient"}
                      </h2>

                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition"
                        title="Edit name"
                      >
                        <Edit3 size={15} />
                      </button>

                      {nameSuccess && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 size={14} />
                          Updated
                        </span>
                      )}
                    </div>
                  ) : (
                    <form
                      onSubmit={handleNameSubmit}
                      className="flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        value={userName}
                        onChange={(e) =>
                          setUserName(e.target.value)
                        }
                        className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Full name"
                      />

                      <button
                        type="submit"
                        disabled={nameLoading}
                        className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                      >
                        {nameLoading ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Check size={15} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingName(false);
                          setUserName(
                            user?.Name ||
                              user?.name ||
                              ""
                          );
                          setNameError(null);
                        }}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                      >
                        <X size={15} />
                      </button>
                    </form>
                  )}

                  {nameError && (
                    <p className="text-xs text-red-600 mt-1">
                      {nameError}
                    </p>
                  )}

                  <p className="text-sm text-slate-500 mt-1 truncate">
                    {user?.emailId ||
                      user?.email ||
                      "No email address"}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                      <UserRound size={12} />
                      {user?.role || "Patient"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={13} />
                      Account active
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="w-full lg:max-w-sm">
                <div className="border border-slate-200 bg-slate-50 rounded-xl p-4">

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <MapPin
                          size={15}
                          className="text-blue-700"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Current location
                        </p>
                        <p className="text-xs font-medium text-slate-700">
                          Used for nearby services
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={getUserLocation}
                      disabled={location.loading}
                      className="p-1.5 rounded-lg text-blue-700 hover:bg-white transition disabled:opacity-50"
                      title="Refresh location"
                    >
                      <Navigation
                        size={14}
                        className={
                          location.loading
                            ? "animate-spin"
                            : ""
                        }
                      />
                    </button>
                  </div>

                  {location.loading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Detecting your location...
                    </div>
                  ) : location.error ? (
                    <p className="text-xs text-red-600">
                      {location.error}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
                      {location.address ||
                        "Location not available"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------
            Main content
        -------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Medical profile */}
          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">

            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Stethoscope
                      size={19}
                      className="text-blue-700"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Medical Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Keep your health details up to date.
                    </p>
                  </div>
                </div>

                {!isEditingMedical ? (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditingMedical(true)
                    }
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditingMedical(false)
                    }
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6">

              {medicalError && (
                <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <AlertCircle
                    size={17}
                    className="shrink-0 mt-0.5"
                  />
                  <span>{medicalError}</span>
                </div>
              )}

              {medicalLoading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2
                    size={26}
                    className="animate-spin text-blue-600 mb-3"
                  />
                  <p className="text-sm text-slate-500">
                    Loading medical information...
                  </p>
                </div>
              ) : isEditingMedical ? (

                <form
                  onSubmit={handleSubmit(onMedicalSubmit)}
                  className="space-y-5"
                >

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Blood group
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <select
                        {...register("bloodGroup", {
                          required:
                            "Blood group is required",
                        })}
                        className={`w-full px-3.5 py-3 border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.bloodGroup
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                      >
                        <option value="">
                          Select blood group
                        </option>

                        {[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ].map((group) => (
                          <option
                            key={group}
                            value={group}
                          >
                            {group}
                          </option>
                        ))}
                      </select>

                      {errors.bloodGroup && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {errors.bloodGroup.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Age
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        type="number"
                        {...register("age", {
                          required: "Age is required",
                          min: {
                            value: 1,
                            message: "Invalid age",
                          },
                          max: {
                            value: 120,
                            message: "Invalid age",
                          },
                        })}
                        placeholder="Enter age"
                        className={`w-full px-3.5 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.age
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                      />

                      {errors.age && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {errors.age.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Known allergies
                    </label>

                    <input
                      type="text"
                      {...register("allergies")}
                      placeholder="e.g. Penicillin, dust"
                      className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Chronic conditions
                    </label>

                    <input
                      type="text"
                      {...register("chronicDiseases")}
                      placeholder="e.g. Asthma, hypertension"
                      className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Emergency contact
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        {...register(
                          "emergencyContact",
                          {
                            required:
                              "Emergency contact is required",
                            pattern: {
                              value:
                                /^[0-9]{10,12}$/,
                              message:
                                "Enter a valid phone number",
                            },
                          }
                        )}
                        placeholder="10-digit mobile number"
                        className={`w-full pl-10 pr-3.5 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ${
                          errors.emergencyContact
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                      />
                    </div>

                    {errors.emergencyContact && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {errors.emergencyContact.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck
                        size={15}
                        className="text-emerald-600"
                      />
                      Your information is handled as part of your patient profile.
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={16} />
                      )}

                      Save changes
                    </button>
                  </div>
                </form>

              ) : (

                <div className="space-y-5">

                  {/* Blood group highlight */}
                  <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white border border-blue-100 flex items-center justify-center">
                        <Droplets
                          size={21}
                          className="text-blue-700"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-600">
                          Blood group
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Patient blood type
                        </p>
                      </div>
                    </div>

                    <span className="text-2xl font-bold text-blue-800">
                      {medicalInfo?.bloodGroup ||
                        "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                        Age
                      </p>

                      <p className="text-base font-semibold text-slate-800 mt-1">
                        {medicalInfo?.age
                          ? `${medicalInfo.age} years`
                          : "Not provided"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                        Allergies
                      </p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {medicalInfo?.allergies ||
                          "None declared"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                        Chronic conditions
                      </p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {medicalInfo?.chronicDiseases ||
                          "None declared"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                        Emergency contact
                      </p>

                      <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-2">
                        <Phone
                          size={14}
                          className="text-slate-400"
                        />
                        {medicalInfo?.emergencyContact ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <ShieldCheck
                      size={17}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />

                    <p className="text-xs leading-relaxed text-slate-500">
                      Keep this information accurate so it can be
                      referenced when you use healthcare and
                      blood-sample services.
                    </p>
                  </div>

                </div>
              )}
            </div>
          </section>

          {/* --------------------------------
              Booking panel
          -------------------------------- */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">

            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Calendar
                    size={19}
                    className="text-amber-700"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Pending Bookings
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Current sample requests
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">

              {bookingsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader2
                    size={25}
                    className="animate-spin text-blue-600 mb-3"
                  />

                  <p className="text-sm text-slate-500">
                    Loading bookings...
                  </p>
                </div>

              ) : bookingsError ? (

                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={16}
                      className="text-red-600 mt-0.5"
                    />

                    <p className="text-xs text-red-700">
                      {bookingsError}
                    </p>
                  </div>
                </div>

              ) : pendingBookings.length === 0 ? (

                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                    <Calendar
                      size={20}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    No pending bookings
                  </p>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Your active sample requests will appear here.
                  </p>
                </div>

              ) : (

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">

                  {pendingBookings.map((booking) => (

                    <div
                      key={booking._id}
                      className="border border-amber-100 bg-amber-50/50 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                            Sample ID
                          </p>

                          <p
                            className="font-mono text-xs font-semibold text-slate-800 truncate mt-1"
                            title={booking.sampleId}
                          >
                            {booking.sampleId}
                          </p>
                        </div>

                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-800">
                          <Clock size={11} />
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Quantity
                          <span className="font-semibold text-slate-800 ml-1">
                            {booking.quantity}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500">
                          {booking.createdAt
                            ? new Date(
                                booking.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>

                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* --------------------------------
            Bottom reassurance
        -------------------------------- */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HeartPulse
              size={15}
              className="text-blue-600"
            />
            Keep your patient information current.
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} />
            Patient information
          </div>
        </div>

      </main>
    </div>
  );
};

export default MyProfile;

