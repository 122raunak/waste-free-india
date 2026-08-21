import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2, Mail, Phone, MapPin, LogOut,
  Package, Plus, ChevronRight,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import defaultProfile from "../../../../public/Profile/profile.png";

function UserProfile() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          { withCredentials: true }
        );
        const u = res.data.user;
        let profileImg = defaultProfile;
        if (u.profileImg?.data) {
          const binary = new Uint8Array(u.profileImg.data);
          profileImg = `data:image/jpeg;base64,${btoa(
            binary.reduce((a, b) => a + String.fromCharCode(b), "")
          )}`;
        }
        setUser({ ...u, profileImg });
      } catch {
        navigate("/user/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/auth/logout`,
        { withCredentials: true }
      );
    } catch {}
    logoutUser();
    navigate("/user/login");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#37B943] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const name = `${user?.FullName?.FirstName || ""} ${user?.FullName?.LastName || ""}`.trim() || "—";

  return (
    <div className="w-full bg-[#f0f0f0] pb-10">
      {/* Banner with avatar + name INSIDE it */}
      <div className="bg-gradient-to-r from-[#37B943] to-[#81E68D] w-full">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-6 pb-16">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/user/profile/edit")}
              className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
            >
              <Edit2 size={12} /> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-white/60 shadow-lg bg-white/20 shrink-0">
              <img src={user?.profileImg || defaultProfile} alt="profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{name}</h1>
              <span className="inline-block text-xs font-semibold text-white/80 bg-white/20 px-2.5 py-0.5 rounded-full mt-1">
                Waste Seller
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards pulled up over banner bottom */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-8 space-y-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader title="Contact Info" />
          <ContactRow icon={<Mail size={15} className="text-[#37B943]" />} label="Email" value={user?.email} />
          <ContactRow icon={<Phone size={15} className="text-[#37B943]" />} label="Phone" value={user?.ContactNo} muted={!user?.ContactNo} placeholder="Not set — tap Edit to add" />
          <ContactRow icon={<MapPin size={15} className="text-[#37B943]" />} label="Address" value={user?.Address} muted={!user?.Address} placeholder="Not set — tap Edit to add" last />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader title="Your Activity" />
          <ActionRow icon={<Package size={16} className="text-[#37B943]" />} iconBg="bg-green-50" title="My Listings" subtitle="View and manage your waste listings" onClick={() => navigate("/user/my-listings")} />
          <ActionRow icon={<Plus size={16} className="text-[#37B943]" />} iconBg="bg-green-50" title="Sell Waste" subtitle="Create a new listing" onClick={() => navigate("/user/sellingpage/sellscrap")} last />
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-red-50 hover:border-red-100 transition group">
          <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0">
            <LogOut size={16} className="text-red-500" />
          </div>
          <span className="text-sm font-medium text-red-500">Log Out</span>
        </button>
      </div>
    </div>
  );
}

const SectionHeader = ({ title }) => (
  <div className="px-5 pt-4 pb-2">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
  </div>
);

const ContactRow = ({ icon, label, value, muted, placeholder, last }) => (
  <div className={`flex items-center gap-3 px-5 py-3 ${!last ? "border-b border-gray-100" : "pb-4"}`}>
    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-medium truncate ${muted ? "text-gray-400 italic" : "text-gray-800"}`}>
        {value || placeholder || "—"}
      </p>
    </div>
  </div>
);

const ActionRow = ({ icon, iconBg, title, subtitle, onClick, last }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition text-left ${!last ? "border-b border-gray-100" : "pb-4"}`}>
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
    <ChevronRight size={16} className="text-gray-300 shrink-0" />
  </button>
);

export default UserProfile;