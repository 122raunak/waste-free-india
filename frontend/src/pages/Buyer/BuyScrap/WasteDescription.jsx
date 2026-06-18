import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Weight, Tag, User, Phone, MapPin } from "lucide-react";
import api from "../../../lib/api";

const categoryEmoji = { Paper: "📦", Plastic: "🥤", Metal: "⚙️", "E-waste": "💻" };

function WasteDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#81E68D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!wasteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Item not found</p>
        <button onClick={() => navigate(-1)} className="text-[#41c45a] underline text-sm">Go back</button>
      </div>
    );
  }

  // Already taken by someone else
  const isTaken = wasteData.status !== "pending";

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900 truncate">{wasteData.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Image */}
        <div className="w-full h-52 sm:h-64 bg-gray-200 overflow-hidden">
          {wasteData.image ? (
            <img src={wasteData.image} alt={wasteData.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
              {categoryEmoji[wasteData.category] || "♻️"}
            </div>
          )}
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Title + status */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{wasteData.title}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize shrink-0 ${
                isTaken ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
              }`}>
                {isTaken ? "Taken" : "Available"}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 mb-3">
              <Tag size={13} /> {categoryEmoji[wasteData.category]} {wasteData.category}
            </span>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {wasteData.quantity && (
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <Package size={16} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Qty</p>
                  <p className="text-sm font-semibold text-gray-800">{wasteData.quantity}</p>
                </div>
              )}
              {wasteData.weight && (
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <Weight size={16} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-semibold text-gray-800">{wasteData.weight}</p>
                </div>
              )}
              <div className="bg-green-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-base font-bold text-green-700">₹{wasteData.estimatedPrice}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {wasteData.description && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{wasteData.description}</p>
            </div>
          )}

          {/* Seller info */}
          {wasteData.seller && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Seller Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} className="text-gray-400 shrink-0" />
                  {wasteData.seller.FullName?.FirstName} {wasteData.seller.FullName?.LastName}
                </div>
                {wasteData.seller.ContactNo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    {wasteData.seller.ContactNo}
                  </div>
                )}
                {wasteData.seller.Address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    {wasteData.seller.Address}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={isTaken}
          onClick={() => navigate(`/buyer/listofwaste/${id}/confirm`)}
          className={`flex-1 h-11 rounded-xl font-medium text-sm transition-colors text-white
            ${isTaken
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#41c45a] hover:bg-[#36a84c] active:scale-[0.98]"
            }`}
        >
          {isTaken ? "Already Taken" : "Accept Listing"}
        </button>
      </div>
    </div>
  );
}

export default WasteDescription;