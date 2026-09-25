import { useState, useEffect } from "react";
import axiosClient from "../../Utils/axiosclient";
import HomeNavbar from "@/components/Home/header";
import { Clock, MapPin, AlertCircle } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosClient.get("/item/my-bookings");
        setBookings(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HomeNavbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          My Blood Sample Requests
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No Bookings Found</h3>
            <p className="text-gray-500 text-xs">
              You haven't requested any blood samples yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-600 text-white rounded-2xl font-black text-xl flex items-center justify-center shadow-md shadow-red-200 shrink-0">
                    {booking.sampleId?.BloodGroup || "Blood"}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      ID: {booking._id?.slice(-8).toUpperCase()}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base">
                      {booking.sampleId?.BloodGroup ? `Blood Group ${booking.sampleId.BloodGroup}` : "Sample Request"}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      {booking.adminId?.StoreName || "Medical Store"}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Reserve Active (24h)
                  </span>
                  <span className="text-xs font-bold text-gray-600 mt-1">
                    Qty: {booking.quantity} Unit(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}