import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Mail, Phone, MapPin, LogOut, List, Briefcase, MapIcon, CreditCard } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import defaultProfile from "../../../../public/Profile/profile.png";

const categoryEmoji = { Paper: "📦", Plastic: "🥤", Metal: "⚙️", "E-waste": "💻" };

function BuyerProfile() {
  const navigate = useNavigate();
  const { logoutBuyer } = useContext(AppContext);
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/check`,
          { withCredentials: true }
        );
        const u = res.data.buyer;
        let profileImg = defaultProfile;
        if (u.profileImg?.data) {
          const binary = new Uint8Array(u.profileImg.data);
          profileImg = `data:image/jpeg;base64,${btoa(
            binary.reduce((a, b) => a + String.fromCharCode(b), "")
          )}`;
        }
        setBuyer({ ...u, profileImg });
      } catch {
        navigate("/buyer/login");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/buyer/auth/logout`, { withCredentials: true });
    } catch {}
    logoutBuyer();
    navigate("/buyer/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const name = `${buyer?.FullName?.FirstName || ""} ${buyer?.FullName?.LastName || ""}`.trim() || "—";

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-[#f5f5f5] pb-8">
      {/* Blue header */}
      <div className="bg-gradient-to-r from-[#1976D2] to-[#64B5F6] h-32 md:h-40 w-full relative">
        <button
          onClick={() => navigate("/buyer/profile/edit")}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition"
        >
          <Edit2 size={14} /> Edit
        </button>
        <span className="absolute bottom-4 left-4 text-xs text-white/60 font-medium uppercase tracking-wider">
          WasteFreeIndia Partner
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Avatar */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16 mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 shrink-0">
            <img src={buyer?.profileImg || defaultProfile} alt="profile" className="w-full h-full object-cover" />
          </div>
          <div className="md:mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500">{buyer?.BusinessName || "Scrap Buyer"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact Info</h2>
            <InfoRow icon={<Mail size={15} className="text-[#2196F3]" />} label="Email" value={buyer?.email} />
            <InfoRow icon={<Phone size={15} className="text-[#2196F3]" />} label="Phone" value={buyer?.ContactNo || "Not set"} />
            <InfoRow icon={<MapPin size={15} className="text-[#2196F3]" />} label="Address" value={buyer?.Address || "Not set"} />
            <InfoRow icon={<MapIcon size={15} className="text-[#2196F3]" />} label="Service Area" value={buyer?.ServiceArea || "Not set"} />
          </div>

          {/* Business info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Business</h2>
            <InfoRow icon={<Briefcase size={15} className="text-[#2196F3]" />} label="Business Name" value={buyer?.BusinessName || "Not set"} />

            {/* Waste categories */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Waste Categories</p>
              {buyer?.WasteCategories?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {buyer.WasteCategories.map((cat) => (
                    <span key={cat} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {categoryEmoji[cat]} {cat}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No categories set</p>}
            </div>
          </div>

          {/* Bank details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard size={12} /> Bank Details
            </h2>
            {buyer?.BankDetails?.accountNumber ? (
              <>
                <InfoRow label="Account No" value={`••••${buyer.BankDetails.accountNumber.slice(-4)}`} />
                <InfoRow label="IFSC" value={buyer.BankDetails.ifsc || "—"} />
                <InfoRow label="UPI ID" value={buyer.BankDetails.upiId || "—"} />
              </>
            ) : (
              <p className="text-sm text-gray-400">No bank details added</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Quick Actions</h2>
            <button
              onClick={() => navigate("/buyer/listofwaste")}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#2196F3]/20 flex items-center justify-center">
                  <span className="text-base">🔍</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">Browse Waste</p>
                  <p className="text-xs text-gray-500">Find new listings</p>
                </div>
              </div>
              <span className="text-[#2196F3] group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => navigate("/buyer/my-accepted")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center">
                  <List size={15} className="text-gray-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">My Accepted</p>
                  <p className="text-xs text-gray-500">View confirmed purchases</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-5 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition"
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </div>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-all">{value || "—"}</p>
    </div>
  </div>
);

export default BuyerProfile;