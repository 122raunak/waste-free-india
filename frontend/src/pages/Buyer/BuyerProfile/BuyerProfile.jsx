import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2, Mail, Phone, MapPin, LogOut, List,
  Briefcase, MapIcon, CreditCard, Search, ChevronRight,
} from "lucide-react";
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
    const load = async () => {
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
    load();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/logout`,
        { withCredentials: true }
      );
    } catch {}
    logoutBuyer();
    navigate("/buyer/login");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const name = `${buyer?.FullName?.FirstName || ""} ${buyer?.FullName?.LastName || ""}`.trim() || "—";

  return (
    <div className="w-full bg-[#f0f0f0] pb-10">

      {/* ── Banner — avatar + name INSIDE, same pattern as UserProfile ── */}
      <div className="bg-gradient-to-r from-[#1976D2] to-[#64B5F6] w-full">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-6 pb-16">
          {/* Edit button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/buyer/profile/edit")}
              className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
            >
              <Edit2 size={12} /> Edit Profile
            </button>
          </div>

          {/* Avatar + name row inside banner */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-white/60 shadow-lg bg-white/20 shrink-0">
              <img
                src={buyer?.profileImg || defaultProfile}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{name}</h1>
              <span className="inline-block text-xs font-semibold text-white/80 bg-white/20 px-2.5 py-0.5 rounded-full mt-1">
                {buyer?.BusinessName || "Scrap Buyer"}
              </span>
              <span className="ml-2 inline-block text-[10px] text-white/50 uppercase tracking-widest">
                Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards pulled up over banner bottom ── */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-8 space-y-3">

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader title="Contact Info" />
          <ContactRow icon={<Mail size={15} className="text-[#2196F3]" />} label="Email" value={buyer?.email} />
          <ContactRow icon={<Phone size={15} className="text-[#2196F3]" />} label="Phone" value={buyer?.ContactNo} muted={!buyer?.ContactNo} placeholder="Not set — tap Edit to add" />
          <ContactRow icon={<MapPin size={15} className="text-[#2196F3]" />} label="Address" value={buyer?.Address} muted={!buyer?.Address} placeholder="Not set — tap Edit to add" />
          <ContactRow icon={<MapIcon size={15} className="text-[#2196F3]" />} label="Service Area" value={buyer?.ServiceArea} muted={!buyer?.ServiceArea} placeholder="Not set — tap Edit to add" last />
        </div>

        {/* Business */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader title="Business Info" />
          <ContactRow icon={<Briefcase size={15} className="text-[#2196F3]" />} label="Business Name" value={buyer?.BusinessName} muted={!buyer?.BusinessName} placeholder="Not set — tap Edit to add" />

          {/* Waste categories */}
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">
              Waste Categories
            </p>
            {buyer?.WasteCategories?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {buyer.WasteCategories.map((cat) => (
                  <span key={cat} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                    {categoryEmoji[cat]} {cat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No categories set — tap Edit to add</p>
            )}
          </div>

          {/* Bank details */}
          <div className="px-5 py-3 pb-4">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
              <CreditCard size={10} /> Bank Details
            </p>
            {buyer?.BankDetails?.accountNumber ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="text-gray-400 text-xs">Account: </span>
                  ••••{buyer.BankDetails.accountNumber.slice(-4)}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="text-gray-400 text-xs">IFSC: </span>
                  {buyer.BankDetails.ifsc || "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="text-gray-400 text-xs">UPI: </span>
                  {buyer.BankDetails.upiId || "—"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No bank details added — tap Edit to add</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader title="Quick Actions" />
          <ActionRow
            icon={<Search size={16} className="text-[#2196F3]" />}
            iconBg="bg-blue-50"
            title="Browse Waste"
            subtitle="Find available listings near you"
            onClick={() => navigate("/buyer/listofwaste")}
          />
          <ActionRow
            icon={<List size={16} className="text-[#2196F3]" />}
            iconBg="bg-blue-50"
            title="My Accepted"
            subtitle="View your confirmed purchases"
            onClick={() => navigate("/buyer/my-accepted")}
            last
          />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-red-50 hover:border-red-100 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0">
            <LogOut size={16} className="text-red-500" />
          </div>
          <span className="text-sm font-medium text-red-500">Log Out</span>
        </button>

      </div>
    </div>
  );
}

/* ── Sub-components ── */

const SectionHeader = ({ title }) => (
  <div className="px-5 pt-4 pb-2">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
  </div>
);

const ContactRow = ({ icon, label, value, muted, placeholder, last }) => (
  <div className={`flex items-center gap-3 px-5 py-3 ${!last ? "border-b border-gray-100" : "pb-4"}`}>
    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-medium truncate ${muted ? "text-gray-400 italic" : "text-gray-800"}`}>
        {value || placeholder || "—"}
      </p>
    </div>
  </div>
);

const ActionRow = ({ icon, iconBg, title, subtitle, onClick, last }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition text-left
      ${!last ? "border-b border-gray-100" : "pb-4"}`}
  >
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
    <ChevronRight size={16} className="text-gray-300 shrink-0" />
  </button>
);

export default BuyerProfile;