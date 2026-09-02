// src/components/HeroStores.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../../Utils/axiosclient";
import { 
  Building2, 
  MapPin, 
  Clock, 
  Star, 
  Droplet, 
  Search, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Herohome() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(stores)

 useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await axiosClient.get("/admin/storeinfoforuser");
      
      if (response.data?.success) {
        setStores(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStores();
}, []);

  // Helper function to check if a store is currently open
  const isStoreOpen = (openAt, closeAt) => {
    const currentHour = new Date().getHours();
    return currentHour >= openAt && currentHour < closeAt;
  };

  const filteredStores = stores.filter(
    (store) =>
      store.StoreName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.StoreLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative min-h-[calc(100vh-5rem)] bg-slate-50 overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100 rounded-full blur-3xl -z-10 opacity-70" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-red-200/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4 pt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 font-semibold text-xs uppercase tracking-wider">
            <Droplet className="w-4 h-4 fill-current" />
            Live Blood & Sample Inventories
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Find Nearby <span className="text-red-600">Blood Bank</span> Stores & Verified Labs
          </h1>

          <p className="text-gray-600 text-base sm:text-lg">
            Search active testing centers, compare sample pricing, and check live store hours in real time.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search store name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-100 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </motion.div>

        {/* Store Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              Available Stores ({filteredStores.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-gray-200/60 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500">
              No stores found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => {
                const isOpen = isStoreOpen(store.openAt, store.closeAt);

                return (
                  <motion.div
                    key={store._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between hover:shadow-2xl transition-all group"
                  >
                    <div className="space-y-4">
                      
                      {/* Top Bar: Open/Close status & Rating */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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

                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {store.rating > 0 ? store.rating.toFixed(1) : "New"}
                        </div>
                      </div>

                      {/* Store Title & Location */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {store.StoreName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {store.StoreLocation}
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {store.description}
                      </p>

                      {/* Store Hours */}
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>
                          Hours: <b>{store.openAt}:00 AM</b> - <b>{store.closeAt}:00 PM</b>
                        </span>
                      </div>

                      {/* Available Samples Section */}
                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Available Samples ({store.AvailableSamples?.length || 0})
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {store.AvailableSamples?.map((sample) => (
                            <div
                              key={sample._id}
                              className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl"
                            >
                              <span className="font-black text-xs text-red-600">
                                {sample.BloodGroup}
                              </span>
                              <span className="text-xs text-gray-600 font-bold">
                                ₹{sample.Price}
                              </span>
                              {sample.Discount > 0 && (
                                <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                                  {sample.Discount}% OFF
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6 mt-4 border-t border-gray-100">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-md shadow-red-100 flex items-center justify-center gap-2">
                        View Samples <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}