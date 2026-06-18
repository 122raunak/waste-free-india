import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Phone, MapPin, User, Briefcase } from "lucide-react";
import WasteCard from "../../../components/WasteCard/WasteCard";
import api from "../../../lib/api";

const TABS = ["All", "pending", "assigned", "collected", "completed", "cancelled"];

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Scrap/my-listings");
      setListings(res.data.listings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatingId(itemId);
    try {
      await api.patch(`/Scrap/${itemId}/status`, { status: newStatus });
      setListings((prev) =>
        prev.map((item) => item._id === itemId ? { ...item, status: newStatus } : item)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/Scrap/${itemId}`);
      setListings((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  const filtered = activeTab === "All"
    ? listings
    : listings.filter((l) => l.status === activeTab);

  const assignedCount = listings.filter((l) => l.assignedBuyer).length;

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-0 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">My Listings</h1>
            <p className="text-xs text-gray-400">{listings.length} total · {assignedCount} with buyers</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100">
              <RefreshCw size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => navigate("/user/sellingpage/sellscrap")}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#41c45a] text-white rounded-lg text-sm font-medium hover:bg-[#36a84c] transition-colors"
            >
              <Plus size={14} />
              New
            </button>
          </div>
        </div>

        {/* Tab filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-all border
                ${activeTab === tab
                  ? "bg-[#41c45a] text-white border-[#41c45a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#81E68D]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 font-medium">
              {activeTab === "All" ? "No listings yet" : `No ${activeTab} listings`}
            </p>
            {activeTab === "All" && (
              <button
                onClick={() => navigate("/user/sellingpage/sellscrap")}
                className="mt-4 px-5 py-2.5 bg-[#41c45a] text-white rounded-xl text-sm font-medium"
              >
                List Your Waste
              </button>
            )}
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <WasteCard
                item={item}
                onStatusChange={updatingId === item._id ? undefined : handleStatusChange}
              />

              {/* Assigned buyer info */}
              {item.assignedBuyer && (
                <div className="border-t border-blue-100 px-4 py-3 bg-blue-50">
                  <p className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                    Buyer Assigned
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.assignedBuyer.profileImg || `https://ui-avatars.com/api/?name=${item.assignedBuyer.FullName?.FirstName}&background=e8f4ff&color=2563eb&size=40`}
                      alt="buyer"
                      className="w-10 h-10 rounded-full border border-blue-200 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.assignedBuyer.FullName?.FirstName} {item.assignedBuyer.FullName?.LastName}
                      </p>
                      {item.assignedBuyer.BusinessName && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Briefcase size={11} /> {item.assignedBuyer.BusinessName}
                        </p>
                      )}
                      {item.assignedBuyer.ContactNo && (
                        <a
                          href={`tel:${item.assignedBuyer.ContactNo}`}
                          className="text-xs text-[#41c45a] font-medium flex items-center gap-1"
                        >
                          <Phone size={11} /> {item.assignedBuyer.ContactNo}
                        </a>
                      )}
                      {item.assignedBuyer.Address && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={11} /> {item.assignedBuyer.Address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Delete button */}
              {(item.status === "pending" || item.status === "cancelled") && (
                <div className="border-t border-gray-100 px-4 py-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Delete listing
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyListings;