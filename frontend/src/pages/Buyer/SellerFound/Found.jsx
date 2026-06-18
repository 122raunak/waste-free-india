import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Phone, MapPin, User, Briefcase, ArrowLeft, List } from "lucide-react";
import api from "../../../lib/api";

const categoryEmoji = { Paper: "📦", Plastic: "🥤", Metal: "⚙️", "E-waste": "💻" };

const Found = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/Scrap/show/${id}/confirm/found`);
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6">
        <p className="text-gray-500">Could not load details</p>
        <button onClick={() => navigate("/buyer/listofwaste")} className="text-[#41c45a] underline text-sm">
          Back to listings
        </button>
      </div>
    );
  }

  const buyer = wasteData.assignedBuyer;

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/buyer/listofwaste")} className="p-1 -ml-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900">Confirmed!</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Success banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <CheckCircle2 size={30} className="text-green-600" />
          </div>
          <h2 className="font-bold text-green-800 text-lg">Purchase Confirmed</h2>
          <p className="text-sm text-green-600 mt-1 max-w-xs">
            You've accepted this waste listing. Contact the seller to arrange pickup.
          </p>
        </div>

        {/* Waste summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Waste Item</h3>
          <div className="flex gap-3 items-center">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {wasteData.image ? (
                <img src={wasteData.image} alt={wasteData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {categoryEmoji[wasteData.category] || "♻️"}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{wasteData.title}</p>
              <p className="text-sm text-gray-500">{categoryEmoji[wasteData.category]} {wasteData.category}</p>
              <p className="text-sm font-bold text-green-700 mt-0.5">₹{wasteData.estimatedPrice}</p>
            </div>
          </div>
        </div>

        {/* Seller contact info */}
        {wasteData.seller && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Seller Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8f8ea] flex items-center justify-center shrink-0">
                  <User size={15} className="text-[#41c45a]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {wasteData.seller.FullName?.FirstName} {wasteData.seller.FullName?.LastName}
                  </p>
                </div>
              </div>
              {wasteData.seller.ContactNo && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e8f8ea] flex items-center justify-center shrink-0">
                    <Phone size={15} className="text-[#41c45a]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <a
                      href={`tel:${wasteData.seller.ContactNo}`}
                      className="text-sm font-medium text-[#41c45a] underline"
                    >
                      {wasteData.seller.ContactNo}
                    </a>
                  </div>
                </div>
              )}
              {wasteData.seller.Address && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e8f8ea] flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-[#41c45a]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-800">{wasteData.seller.Address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buyer info (self) */}
        {buyer && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your Info (Shared with Seller)</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User size={13} className="text-gray-400" />
                {buyer.FullName?.FirstName} {buyer.FullName?.LastName}
              </div>
              {buyer.ContactNo && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={13} className="text-gray-400" />
                  {buyer.ContactNo}
                </div>
              )}
              {buyer.BusinessName && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Briefcase size={13} className="text-gray-400" />
                  {buyer.BusinessName}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate("/buyer/listofwaste")}
          className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Browse More
        </button>
        <button
          onClick={() => navigate("/buyer/my-accepted")}
          className="flex-1 h-11 rounded-xl bg-[#41c45a] text-white font-medium text-sm hover:bg-[#36a84c] transition-colors flex items-center justify-center gap-2"
        >
          <List size={16} />
          My Accepted
        </button>
      </div>
    </div>
  );
};

export default Found;