// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axiosClient from "../../Utils/axiosclient"; // Adjust path to your axios instance
import HomeNavbar from "@/components/Home/header"; // Adjust path to your navbar
import {
  Building2,
  PlusCircle,
  Clock,
  MapPin,
  Droplet,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  RefreshCw,
  Edit3,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // 1. Store Form State (POST /admin/setstore)
  const [storeForm, setStoreForm] = useState({
    StoreName: "",
    StoreLocation: "",
    description: "",
    openAt: "9",
    closeAt: "21"
  });
  const [submittingStore, setSubmittingStore] = useState(false);

  // 2. Add Sample Form State (POST /admin/setsample/:id)
  const [sampleForm, setSampleForm] = useState({
    BloodGroup: "A+",
    Price: "",
    TotalStock: "10",
    Discount: "0",
    Avilability: true
  });
  const [submittingSample, setSubmittingSample] = useState(false);

  // 3. Edit Sample Modal / Inline Form State (PUT /admin/updatestock/:id)
  const [editingSample, setEditingSample] = useState(null);
  const [updatingSample, setUpdatingSample] = useState(false);

  // Fetch logged-in admin store info (GET /admin/storeinfo)
  const fetchAdminStore = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/storeinfo");

      if (res.data?.success && res.data?.data) {
        const store = res.data.data;
        setStoreData(store);
        
        // Pre-fill store form with current values
        setStoreForm({
          StoreName: store.StoreName || "",
          StoreLocation: store.StoreLocation || "",
          description: store.description || "",
          openAt: store.openAt ?? "9",
          closeAt: store.closeAt ?? "21"
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to load admin store info:", err);
        showMessage("error", err.response?.data?.message || "Failed to load store data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStore();
  }, []);

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
  };

  // Submit Store Data (POST /admin/setstore)
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingStore(true);
      const payload = {
        StoreName: storeForm.StoreName,
        StoreLocation: storeForm.StoreLocation,
        description: storeForm.description,
        openAt: Number(storeForm.openAt),
        closeAt: Number(storeForm.closeAt)
      };

      const res = await axiosClient.post("/admin/setstore", payload);

      if (res.data) {
        showMessage("success", res.data.message || "Store saved successfully!");
        fetchAdminStore();
      }
    } catch (err) {
      console.error("Store Save Error:", err);
      showMessage("error", err.response?.data?.message || "Failed to save store details.");
    } finally {
      setSubmittingStore(false);
    }
  };

  // Submit New Blood Sample (POST /admin/setsample/:id)
  const handleAddSampleSubmit = async (e) => {
    e.preventDefault();
    if (!storeData?._id) {
      showMessage("error", "Please configure your store first before adding samples.");
      return;
    }

    try {
      setSubmittingSample(true);
      const payload = {
        BloodGroup: sampleForm.BloodGroup,
        Price: Number(sampleForm.Price),
        TotalStock: Number(sampleForm.TotalStock),
        Discount: Number(sampleForm.Discount),
        Avilability: sampleForm.Avilability
      };

      const res = await axiosClient.post(`/admin/setsample/${storeData._id}`, payload);

      if (res.data) {
        showMessage("success", "Blood sample added successfully!");
        setSampleForm({
          BloodGroup: "A+",
          Price: "",
          TotalStock: "10",
          Discount: "0",
          Avilability: true
        });
        fetchAdminStore(); // Refresh store samples list
      }
    } catch (err) {
      console.error("Sample Creation Error:", err);
      showMessage("error", err.response?.data?.message || "Failed to add blood sample.");
    } finally {
      setSubmittingSample(false);
    }
  };

  // Update Existing Sample (PUT /admin/updatestock/:id)
  const handleUpdateSampleSubmit = async (e) => {
    e.preventDefault();
    if (!editingSample?._id) return;

    try {
      setUpdatingSample(true);
      const payload = {
        BloodGroup: editingSample.BloodGroup,
        Price: Number(editingSample.Price),
        TotalStock: Number(editingSample.TotalStock),
        Discount: Number(editingSample.Discount),
        Avilability: editingSample.Avilability
      };

      const res = await axiosClient.put(`/admin/updatestock/${editingSample._id}`, payload);

      if (res.data) {
        showMessage("success", "Sample updated successfully!");
        setEditingSample(null);
        fetchAdminStore();
      }
    } catch (err) {
      console.error("Sample Update Error:", err);
      showMessage("error", err.response?.data?.message || "Failed to update sample.");
    } finally {
      setUpdatingSample(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HomeNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" /> Admin Management Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {storeData ? storeData.StoreName : "Setup Your Blood Bank"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Configure store profiles, manage blood sample stock, and view customer requests.
            </p>
          </div>

          <Button
            onClick={fetchAdminStore}
            variant="outline"
            className="flex items-center gap-2 rounded-xl text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Store
          </Button>
        </div>

        {/* Status Toast Notification */}
        {statusMessage.text && (
          <div
            className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-md transition-all ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            {statusMessage.text}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 h-96 bg-gray-200/60 rounded-3xl animate-pulse" />
            <div className="lg:col-span-6 h-96 bg-gray-200/60 rounded-3xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Store Profile Configuration (POST /admin/setstore) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-bold text-gray-900">Store Profile</h2>
                </div>
                {storeData && (
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>

              <form onSubmit={handleStoreSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Central Blood Bank"
                    value={storeForm.StoreName}
                    onChange={(e) => setStoreForm({ ...storeForm, StoreName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Store Location / Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block C, Medical Center, Delhi"
                    value={storeForm.StoreLocation}
                    onChange={(e) => setStoreForm({ ...storeForm, StoreLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide store description or emergency contact instructions..."
                    value={storeForm.description}
                    onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Opening Time (24h)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={storeForm.openAt}
                      onChange={(e) => setStoreForm({ ...storeForm, openAt: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Closing Time (24h)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={storeForm.closeAt}
                      onChange={(e) => setStoreForm({ ...storeForm, closeAt: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submittingStore}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-md shadow-red-100 transition-all mt-2"
                >
                  {submittingStore ? "Saving Store..." : storeData ? "Update Store Info" : "Create Store Profile"}
                </Button>
              </form>
            </div>

            {/* RIGHT COLUMN: Add Blood Sample Form (POST /admin/setsample/:id) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <Droplet className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Add Sample Inventory</h2>
              </div>

              {!storeData ? (
                <div className="p-8 bg-slate-50 border border-dashed border-gray-200 rounded-2xl text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">Store Profile Required</p>
                  <p className="text-xs text-gray-500">
                    Please create and save your Store Profile on the left before adding blood samples.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddSampleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={sampleForm.BloodGroup}
                        onChange={(e) => setSampleForm({ ...sampleForm, BloodGroup: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-red-600 focus:bg-white transition-all"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 1200"
                        value={sampleForm.Price}
                        onChange={(e) => setSampleForm({ ...sampleForm, Price: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Total Stock
                      </label>
                      <input
                        type="number"
                        value={sampleForm.TotalStock}
                        onChange={(e) => setSampleForm({ ...sampleForm, TotalStock: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={sampleForm.Discount}
                        onChange={(e) => setSampleForm({ ...sampleForm, Discount: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Status
                      </label>
                      <select
                        value={sampleForm.Avilability.toString()}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, Avilability: e.target.value === "true" })
                        }
                        className="w-full px-3 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-red-600 focus:bg-white transition-all"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingSample}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-md transition-all mt-2"
                  >
                    {submittingSample ? "Adding Sample..." : "Add Blood Sample"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: Existing Samples & Update Controls (PUT /admin/updatestock/:id) */}
        {storeData && (
          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600" />
                Current Inventory ({storeData.AvailableSamples?.length || 0})
              </h2>
            </div>

            {!storeData.AvailableSamples || storeData.AvailableSamples.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-gray-100 text-center text-gray-500">
                No blood samples currently added to your store. Use the form above to add samples.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {storeData.AvailableSamples.map((sample) => (
                  <div
                    key={sample._id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                          {sample.BloodGroup}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            sample.Avilability !== false
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}
                        >
                          {sample.Avilability !== false ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                          <span>Price:</span>
                          <b className="text-gray-900">₹{sample.Price}</b>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                          <span>Stock:</span>
                          <b className="text-gray-900">{sample.TotalStock || 0} units</b>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                          <span>Discount:</span>
                          <b className="text-red-600">{sample.Discount || 0}%</b>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setEditingSample(sample)}
                      variant="outline"
                      className="w-full flex items-center gap-2 rounded-xl text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Stock / Price
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: Edit Stock Form */}
        {editingSample && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Update {editingSample.BloodGroup} Sample
                </h3>
                <button
                  onClick={() => setEditingSample(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateSampleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingSample.Price}
                      onChange={(e) =>
                        setEditingSample({ ...editingSample, Price: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Total Stock
                    </label>
                    <input
                      type="number"
                      value={editingSample.TotalStock || ""}
                      onChange={(e) =>
                        setEditingSample({ ...editingSample, TotalStock: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingSample.Discount || ""}
                      onChange={(e) =>
                        setEditingSample({ ...editingSample, Discount: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Availability
                    </label>
                    <select
                      value={editingSample.Avilability?.toString()}
                      onChange={(e) =>
                        setEditingSample({
                          ...editingSample,
                          Avilability: e.target.value === "true"
                        })
                      }
                      className="w-full px-3 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-red-600"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingSample(null)}
                    className="w-1/2 py-5 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updatingSample}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-xl"
                  >
                    {updatingSample ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}