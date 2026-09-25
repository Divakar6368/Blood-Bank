import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import { fetchSampleByStore } from "../../bookingSlice";
import { fetchMedicalInfo, saveMedicalInfo } from "../../authslice";
import axiosClient from "../../Utils/axiosclient";

import HomeNavbar from "@/components/Home/header";

import {
  Droplet,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Building2,
  AlertCircle,
  HeartPulse,
  X,
  Loader2,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentSamples,
    loading: bookingLoading,
  } = useSelector((state) => state.booking);

  const {
    user,
    medicalInfo,
    loading: authLoading,
  } = useSelector((state) => state.auth);

  const sampleId = searchParams.get("sampleId");

  
  const [store, setStore] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [showMedicalModal, setShowMedicalModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      BloodGroup: "A+",
      Age: "",
      Anydisease: "None",
    },
  });




  const sample = currentSamples.find(
  (item) => String(item._id) === String(sampleId)
  );

  useEffect(() => {
    dispatch(fetchMedicalInfo());
  }, [dispatch]);

  useEffect(() => {
    if (medicalInfo) {
      reset({
        BloodGroup: medicalInfo.BloodGroup || "A+",
        Age: medicalInfo.Age ?? "",
        Anydisease: medicalInfo.Anydisease || "None",
      });
    }
  }, [medicalInfo, reset]);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchSampleByStore(storeId));
    }
  }, [storeId, dispatch]);




  
  const price = sample?.Price || 0;
  const discount = sample?.Discount || 0;

  const priceAfterDiscount =
    discount > 0
      ? price - (price * discount) / 100
      : price;

  const totalCost = priceAfterDiscount * quantity;

  
  const processFinalBooking = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        sampleId,
        storeId,
        quantity: Number(quantity),
      };

      const response = await axiosClient.post(
        "/item/book",
        payload
      );

      if (response.data) {
        setBookingSuccess(
          response.data.booking || response.data
        );
      }
    } catch (err) {
      console.error("Booking failed:", err);

      setErrorMessage(
        err.response?.data?.message ||
          "Booking transaction failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const handleBookingSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setErrorMessage("");

    if (!sampleId || !storeId) {
      setErrorMessage(
        "Missing required storeId or sampleId."
      );
      return;
    }

    const hasValidMedicalInfo =
      !!medicalInfo &&
      !!medicalInfo.BloodGroup &&
      Number(medicalInfo.Age) > 0;

    if (hasValidMedicalInfo) {
      await processFinalBooking();
    } else {
      setShowMedicalModal(true);
    }
  };

  const onMedicalFormSubmit = async (formData) => {
    setErrorMessage("");

    const payload = {
      BloodGroup: formData.BloodGroup,
      Age: Number(formData.Age),
      Anydisease: formData.Anydisease || "None",
    };

    const resultAction = await dispatch(
      saveMedicalInfo(payload)
    );

    if (saveMedicalInfo.fulfilled.match(resultAction)) {
      setShowMedicalModal(false);
      await processFinalBooking();
    } else {
      setErrorMessage(
        resultAction.payload ||
          "Failed to save medical information."
      );
    }
  };


  if (bookingLoading && !sample) {
  
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <HomeNavbar />

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-red-200 rounded-full" />

            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        
      </div>
    );
  }

  if (!sampleId || !storeId || !sample) {
    
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <HomeNavbar />

        <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sample / Store Parameters Missing
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Unable to locate the sample parameters. Please go
            back to the store page and re-select your blood
            sample.
          </p>

          <Button
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }
 console.log("FINAL PAGE STATE", {
  bookingLoading,
  authLoading,
  sample,
  sampleId,
  storeId,
});
  return (
  
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      <HomeNavbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          Back to Store
        </button>

        
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Confirm Blood Sample Request
        </h1>

      
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />

            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">

            {/* User & Medical Verification */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-bold text-sm text-gray-900">
                    Patient:{" "}
                    {user?.name ||
                      user?.email ||
                      "Logged In User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {medicalInfo
                      ? `Medical Info Verified (Group: ${medicalInfo.BloodGroup}, Age: ${medicalInfo.Age})`
                      : "Medical Info Pending Verification"}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  medicalInfo
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {medicalInfo
                  ? "Verified"
                  : "Action Needed"}
              </span>
            </div>

          
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-600" />

                Selected Blood Sample
              </h2>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-2xl font-black text-2xl flex items-center justify-center shadow-md shadow-red-200">
                    {sample.BloodGroup}
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900 text-lg">
                      Blood Group:{" "}
                      {sample.BloodGroup}
                    </h3>

                    <p className="text-xs text-gray-500 font-medium">
                      ₹{priceAfterDiscount.toFixed(2)} / unit

                      {discount > 0 && (
                        <span className="line-through text-gray-400 text-xs ml-2">
                          ₹{price}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-500">
                    Qty:
                  </span>

                  <select
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number(e.target.value))
                    }
                    className="font-bold text-sm bg-transparent outline-none cursor-pointer"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>
            </div>

          
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-red-600" />

                Store Details
              </h2>

              <div>
                <p className="font-bold text-gray-900 text-base">
                  {store?.StoreName ||
                    "Authorized Store Center"}
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />

                  {store?.StoreLocation ||
                    `Store ID: ${storeId}`}
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />

                  Operating Hours:{" "}
                  {store?.openAt || 9}:00 -{" "}
                  {store?.closeAt || 21}:00
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 p-6 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />

                Mandatory 24-Hour Pickup Notice
              </div>

              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong>Please Note:</strong> Visit the
                store within 24 hours to verify your details
                and collect your request. Unclaimed requests
                automatically expire.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6 sticky top-8">

              {/* Bill title */}
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                Total Bill
              </h2>

              {/* Bill details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>
                    {sample.BloodGroup} ({quantity}{" "}
                    {quantity === 1
                      ? "Unit"
                      : "Units"})
                  </span>

                  <span className="font-bold text-gray-900">
                    ₹{totalCost.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-xs font-semibold">
                    <span>
                      Discount ({discount}%)
                    </span>

                    <span>
                      - ₹
                      {(
                        ((price * discount) / 100) *
                        quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Final total */}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
                  <span>Total</span>

                  <span className="text-red-600 text-xl">
                    ₹{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />

                  Pay Upon Verification
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  No online payment required now. Reserve
                  your stock instantly and settle payment
                  directly at the store.
                </p>
              </div>

              {/* Booking button */}
              <Button
                onClick={handleBookingSubmit}
                disabled={
                  isSubmitting || authLoading
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-2xl shadow-lg shadow-red-200 transition-all text-base cursor-pointer"
              >
                {isSubmitting
                  ? "Creating Booking..."
                  : "Request Sample"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* MEDICAL DETAILS MODAL */}
      <AnimatePresence>
        {showMedicalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative"
            >
              {/* Close */}
              <button
                onClick={() =>
                  setShowMedicalModal(false)
                }
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
                  <HeartPulse className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    Medical Info Required
                  </h3>

                  <p className="text-xs text-gray-500">
                    Complete your health profile to
                    process this request.
                  </p>
                </div>
              </div>

              {/* Medical form */}
              <form
                onSubmit={handleSubmit(
                  onMedicalFormSubmit
                )}
                className="space-y-4"
              >
                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>

                  <select
                    {...register("BloodGroup", {
                      required:
                        "Blood Group is required",
                    })}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ].map((bg) => (
                      <option
                        key={bg}
                        value={bg}
                      >
                        {bg}
                      </option>
                    ))}
                  </select>

                  {errors.BloodGroup && (
                    <p className="text-xs text-red-500 mt-1">
                      {
                        errors.BloodGroup
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Age
                  </label>

                  <input
                    type="number"
                    placeholder="Enter your age"
                    {...register("Age", {
                      required:
                        "Age is required",
                      min: {
                        value: 0,
                        message:
                          "Age cannot be negative",
                      },
                      max: {
                        value: 120,
                        message:
                          "Age cannot exceed 120",
                      },
                    })}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />

                  {errors.Age && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.Age.message}
                    </p>
                  )}
                </div>

                {/* Existing conditions */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Any Existing Conditions
                  </label>

                  <input
                    type="text"
                    placeholder="None, Diabetes, Hypertension, etc."
                    {...register("Anydisease", {
                      maxLength: {
                        value: 50,
                        message:
                          "Cannot exceed 50 characters",
                      },
                    })}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />

                  {errors.Anydisease && (
                    <p className="text-xs text-red-500 mt-1">
                      {
                        errors.Anydisease
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />

                        Saving...
                      </>
                    ) : (
                      "Save Profile & Complete Request"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl">

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900">
                Booking Successful!
              </h3>

              <p className="text-xs text-gray-500 font-medium">
                Your sample request has been reserved in
                our system.
              </p>
            </div>

            <Button
              onClick={() =>
                navigate("/my-bookings")
              }
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl cursor-pointer"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

