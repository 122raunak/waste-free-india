import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, User, RefreshCw, CheckCircle2, X, IndianRupee } from "lucide-react";
import WasteCard from "../../../components/WasteCard/WasteCard";
import api from "../../../lib/api";

const CompleteModal = ({ item, onClose, onSuccess }) => {
  const [finalPrice, setFinalPrice] = useState(item.estimatedPrice || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!finalPrice || Number(finalPrice) <= 0) {
      setError("Please enter a valid price greater than 0");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/Scrap/${item._id}/complete`, { finalPrice: Number(finalPrice) });
      onSuccess(item._id, Number(finalPrice));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#37B943] to-[#81E68D] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base">Complete Transaction</h2>
            <p className="text-white/80 text-xs mt-0.5">Enter the final price paid</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <X size={14} className="text-white" />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
              {item.image
                ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-lg">♻️</div>
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">Estimated: ₹{item.estimatedPrice}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Final Price Paid (₹)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <IndianRupee size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Enter amount paid"
                className="w-full h-12 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#37B943] font-semibold text-gray-800"
                autoFocus
              />
            </div>
            {finalPrice && Number(finalPrice) > 0 && (
              <p className={`text-xs mt-1.5 font-medium ${
                Number(finalPrice) > item.estimatedPrice ? "text-green-600"
                : Number(finalPrice) < item.estimatedPrice ? "text-orange-500"
                : "text-gray-500"
              }`}>
                {Number(finalPrice) > item.estimatedPrice
                  ? `+₹${Number(finalPrice) - item.estimatedPrice} above your estimate`
                  : Number(finalPrice) < item.estimatedPrice
                  ? `₹${item.estimatedPrice - Number(finalPrice)} below your estimate`
                  : "Exactly as estimated"}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-xs text-blue-700">
            📧 The seller will receive an email receipt with the final price you enter.
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 h-11 border border-gray-200 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !finalPrice}
              className="flex-1 h-11 bg-[#37B943] hover:bg-[#2ea038] text-white font-semibold rounded-xl text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <CheckCircle2 size={16} />
              }
              {submitting ? "Completing..." : "Mark Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function MyAccepted() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
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

  const handleCompleteSuccess = (itemId, finalPrice) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, status: "completed", finalPrice } : item
      )
    );
  };

  const completedCount = items.filter((i) => i.status === "completed").length;
  const pendingCount = items.filter((i) => i.status === "assigned").length;

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-gray-900">My Accepted</h1>
          <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100">
            <RefreshCw size={16} className="text-gray-500" />
          </button>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">{pendingCount} pending pickup</span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">{completedCount} completed</span>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No accepted listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Browse listings and confirm purchases</p>
            <button onClick={() => navigate("/buyer/listofwaste")} className="mt-4 px-5 py-2.5 bg-[#41c45a] text-white rounded-xl text-sm font-medium">
              Browse Waste
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <WasteCard item={item} />

              {item.seller && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Seller Contact</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={13} className="text-gray-400" />
                      {item.seller.FullName?.FirstName} {item.seller.FullName?.LastName}
                    </div>
                    {item.seller.ContactNo && (
                      <a href={`tel:${item.seller.ContactNo}`} className="flex items-center gap-2 text-sm text-[#41c45a] font-medium">
                        <Phone size={13} />{item.seller.ContactNo}
                      </a>
                    )}
                    {item.seller.Address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={13} className="text-gray-400" />{item.seller.Address}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.status === "assigned" && (
                <div className="border-t border-green-100 px-4 py-3 bg-green-50">
                  <p className="text-xs text-green-700 mb-2">Have you picked up this waste? Mark it as complete and enter the price paid.</p>
                  <button
                    onClick={() => setActiveModal(item)}
                    className="w-full h-10 bg-[#37B943] hover:bg-[#2ea038] text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={15} />
                    Mark as Collected & Complete
                  </button>
                </div>
              )}

              {item.status === "completed" && item.finalPrice && (
                <div className="border-t border-green-200 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Transaction Complete</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Final price paid</p>
                      <p className="text-lg font-bold text-green-700">₹{item.finalPrice}</p>
                    </div>
                  </div>
                  {item.estimatedPrice && (
                    <p className={`text-xs mt-1 ${
                      item.finalPrice > item.estimatedPrice ? "text-green-600"
                      : item.finalPrice < item.estimatedPrice ? "text-orange-500"
                      : "text-gray-500"
                    }`}>
                      {item.finalPrice > item.estimatedPrice
                        ? `+₹${item.finalPrice - item.estimatedPrice} above estimate`
                        : item.finalPrice < item.estimatedPrice
                        ? `₹${item.estimatedPrice - item.finalPrice} below estimate`
                        : "Exactly as estimated"}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {activeModal && (
        <CompleteModal
          item={activeModal}
          onClose={() => setActiveModal(null)}
          onSuccess={handleCompleteSuccess}
        />
      )}
    </div>
  );
}

export default MyAccepted;