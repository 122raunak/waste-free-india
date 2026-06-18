import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, User, RefreshCw } from "lucide-react";
import WasteCard from "../../../components/WasteCard/WasteCard";
import api from "../../../lib/api";

const statusColors = {
  pending:   "bg-yellow-100 text-yellow-700",
  assigned:  "bg-blue-100 text-blue-700",
  collected: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

function MyAccepted() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Scrap/my-accepted");
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">My Accepted Listings</h1>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100">
          <RefreshCw size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No accepted listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Browse listings and confirm purchases</p>
            <button
              onClick={() => navigate("/buyer/listofwaste")}
              className="mt-4 px-5 py-2.5 bg-[#41c45a] text-white rounded-xl text-sm font-medium"
            >
              Browse Waste
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <WasteCard item={item} />

              {/* Seller contact */}
              {item.seller && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Seller Contact</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={13} className="text-gray-400" />
                      {item.seller.FullName?.FirstName} {item.seller.FullName?.LastName}
                    </div>
                    {item.seller.ContactNo && (
                      <a
                        href={`tel:${item.seller.ContactNo}`}
                        className="flex items-center gap-2 text-sm text-[#41c45a] font-medium"
                      >
                        <Phone size={13} />
                        {item.seller.ContactNo}
                      </a>
                    )}
                    {item.seller.Address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={13} className="text-gray-400" />
                        {item.seller.Address}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAccepted;