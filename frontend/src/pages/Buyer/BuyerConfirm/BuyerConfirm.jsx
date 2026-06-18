import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../../../lib/api";

const categoryEmoji = { Paper: "📦", Plastic: "🥤", Metal: "⚙️", "E-waste": "💻" };

function BuyerConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/Scrap/show/${id}`);
        setWasteData(res.data.wasteItem);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      const res = await api.post(`/Scrap/show/${id}/confirm`, {});
      if (res.status === 200) {
        navigate(`/buyer/listofwaste/${id}/found`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to confirm. Item may have been taken.";
      setError(msg);
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#81E68D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!wasteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6">
        <AlertCircle className="text-red-400" size={40} />
        <p className="text-gray-600 text-center">Item not found</p>
        <button onClick={() => navigate(-1)} className="text-[#41c45a] underline text-sm">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900">Confirm Purchase</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Confirmation notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            By confirming, you agree to collect this waste from the seller. The seller will be notified with your contact details.
          </p>
        </div>

        {/* Waste summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {wasteData.image ? (
                <img src={wasteData.image} alt={wasteData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {categoryEmoji[wasteData.category] || "♻️"}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{wasteData.title}</h3>
              <p className="text-sm text-gray-500">{categoryEmoji[wasteData.category]} {wasteData.category}</p>
              <p className="text-base font-bold text-green-700 mt-1">₹{wasteData.estimatedPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
            {wasteData.quantity && (
              <div>
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="text-sm font-medium text-gray-800">{wasteData.quantity} units</p>
              </div>
            )}
            {wasteData.weight && (
              <div>
                <p className="text-xs text-gray-400">Weight</p>
                <p className="text-sm font-medium text-gray-800">{wasteData.weight}</p>
              </div>
            )}
          </div>
        </div>

        {/* Seller info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Seller Information</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-800">
                  {wasteData.seller?.FullName?.FirstName} {wasteData.seller?.FullName?.LastName}
                </p>
              </div>
            </div>
            {wasteData.seller?.ContactNo && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Contact</p>
                  <p className="text-sm font-medium text-gray-800">{wasteData.seller.ContactNo}</p>
                </div>
              </div>
            )}
            {wasteData.seller?.Address && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-800">{wasteData.seller.Address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="flex-1 h-11 rounded-xl bg-[#41c45a] hover:bg-[#36a84c] active:scale-[0.98] text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {confirming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Confirm
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default BuyerConfirm;