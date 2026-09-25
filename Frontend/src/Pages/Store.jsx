import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import HomeNavbar from "@/components/Home/header";
import { getstoreinformation } from "../../storeslice";
import axiosClient from "../../Utils/axiosclient";
import {
  Building2,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  Bot,
  UploadCloud,
  FileText,
  Droplet,
  CheckCircle2,
  XCircle,
  Tag,
  ShieldCheck,
  Sparkles,
  X,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreDetails() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { info, loading: reduxLoading } = useSelector((state) => state.str);

  const [storeData, setStoreData] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userBookings, setUserBookings] = useState([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [checkingBookings, setCheckingBookings] = useState(false);

  useEffect(() => {
    if (!info || info.length === 0) {
      dispatch(getstoreinformation());
    }
  }, [dispatch, info]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosClient.get("/item/my-bookings");
        setUserBookings(res.data?.data || res.data?.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const loadStoreDetails = async () => {
      setLoading(true);

      const foundStore = info?.find((item) => item._id === storeId);

      if (foundStore) {
        setStoreData(foundStore);
        setSamples(foundStore.AvailableSamples || []);
        setLoading(false);
      } else {
        try {
          const res = await axiosClient.get(`/admin/getsample/${storeId}`);
          if (res.data?.success) {
            setStoreData(res.data.store || null);
            setSamples(res.data.data || res.data.samples || []);
          }
        } catch (error) {
          console.error("Failed to load store sample info:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (storeId) {
      loadStoreDetails();
    }
  }, [storeId, info]);


  const handleRequestSample = async (sample) => {
    try {
      setCheckingBookings(true);
      const res = await axiosClient.get("/item/my-bookings");
      const latestBookings = res.data?.data || res.data?.bookings || userBookings;
      setUserBookings(latestBookings);
      if (latestBookings.length >= 2) {
        setShowLimitModal(true);
        return;
      }
      navigate(`/${storeId}/billing?sampleId=${sample._id}`);
    } catch (err) {
      console.error("Error checking bookings limit:", err);
      if (userBookings.length >= 2) {
        setShowLimitModal(true);
      } else {
        navigate(`/${storeId}/billing?sampleId=${sample._id}`);
      }
    } finally {
      setCheckingBookings(false);
    }
  };

  const isStoreOpen = (openAt, closeAt) => {
    if (openAt === undefined || closeAt === undefined) return false;
    const currentHour = new Date().getHours();
    return currentHour >= openAt && currentHour < closeAt;
  };

  const isOpen = storeData ? isStoreOpen(storeData.openAt, storeData.closeAt) : false;

  return (
   <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <HomeNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stores
        </button>

        {loading || reduxLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-80 bg-gray-200/60 rounded-3xl animate-pulse" />
              <div className="lg:col-span-5 h-80 bg-gray-200/60 rounded-3xl animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200/60 rounded-3xl animate-pulse" />
          </div>
        ) : !storeData ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800">Store Not Found</h2>
            <p className="text-sm text-gray-500 mt-1">
              We couldn't locate the store details for ID: {storeId}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                        isOpen
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      />
                      {isOpen ? "OPEN NOW" : "CLOSED"}
                    </span>

                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 border border-amber-100">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>
                        {storeData.rating > 0 ? storeData.rating.toFixed(1) : "New Store"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                      {storeData.StoreName}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                      {storeData.StoreLocation}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed pt-1">
                    {storeData.description ||
                      "Certified blood bank and medical testing facility with verified inventory tracking."}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-slate-50 p-3.5 rounded-2xl border border-gray-100">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase block">
                        Operating Hours
                      </span>
                      <span className="font-semibold text-gray-900">
                        {storeData.openAt}:00 AM - {storeData.closeAt}:00 PM
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Verified Partner Lab & Certified Blood Storage
                  </div>
                </div>
              </motion.div>

              {/* RIGHT COLUMN: AI Prescription Reader */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-5 bg-linear-to-br from-slate-900 via-slate-800 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-100/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/20 border border-red-100/30 text-green-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" /> AI Prescription Scanner
                    </div>
                    <Bot className="w-6 h-6 text-green-400" />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight">
                    Upload Prescription for AI Verification
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Upload a photo or PDF of your doctor's prescription. Our AI will automatically verify required blood groups and match store availability.
                  </p>

                  <div className="mt-4 border-2 border-dashed border-slate-700 hover:border-red-500/50 bg-slate-800/50 rounded-2xl p-6 text-center transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-700/60 group-hover:bg-red-600/20 group-hover:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors text-slate-300">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">
                      Click to upload or drag & drop prescription
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Supports JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 relative z-10">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 text-sm">
                    <FileText className="w-4 h-4" /> Scan Prescription with AI
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Droplet className="w-6 h-6 text-red-600 fill-current" />
                    Available Blood Samples
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live inventory prices and availability for this facility
                  </p>
                </div>
                <span className="text-xs font-extrabold bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full">
                  {samples.length} Samples Available
                </span>
              </div>

              {samples.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-500">
                  No blood samples currently recorded for this store.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {samples.map((sample) => (
                    <motion.div
                      key={sample._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-gray-100/60 flex flex-col justify-between hover:shadow-xl transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-red-200">
                            {sample.BloodGroup}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              sample.Avilability !== false
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}
                          >
                            {sample.Avilability !== false ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> In Stock
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Unavailable
                              </>
                            )}
                          </span>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Sample Price
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-gray-900">
                              ₹{sample.Price}
                            </span>
                            {sample.Discount > 0 && (
                              <span className="inline-flex items-center gap-0.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                <Tag className="w-3 h-3" /> {sample.Discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 mt-4 border-t border-gray-100">
                        <Button
                          disabled={sample.Avilability === false || checkingBookings}
                          onClick={() => handleRequestSample(sample)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-md shadow-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all cursor-pointer"
                        >
                          {checkingBookings
                            ? "Checking..."
                            : sample.Avilability !== false
                            ? "Request Sample"
                            : "Out of Stock"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <button
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Booking Limit Reached
              </h3>

              <p className="text-sm font-medium text-gray-600 mt-2 leading-relaxed">
                Maximum 2 blood sample booking is allowed.
              </p>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 transition-all cursor-pointer"
                >
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}