import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Mail, Phone, MapPin, LogOut, Package } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import defaultProfile from "../../../../public/Profile/profile.png";

function UserProfile() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/auth/logout`, { withCredentials: true });
    } catch {}
    logoutUser();
    navigate("/user/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#37B943] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const name = `${user?.FullName?.FirstName || ""} ${user?.FullName?.LastName || ""}`.trim() || "—";

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-[#f5f5f5] pb-8">
      {/* Green header banner */}
      <div className="bg-gradient-to-r from-[#37B943] to-[#81E68D] h-32 md:h-40 w-full relative">
        <button
          onClick={() => navigate("/user/profile/edit")}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition"
        >
          <Edit2 size={14} /> Edit
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Avatar — overlaps the banner */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16 mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 shrink-0">
            <img src={user?.profileImg || defaultProfile} alt="profile" className="w-full h-full object-cover" />
          </div>
          <div className="md:mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500">Waste Seller</p>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact Info</h2>
            <InfoRow icon={<Mail size={15} className="text-[#37B943]" />} label="Email" value={user?.email} />
            <InfoRow icon={<Phone size={15} className="text-[#37B943]" />} label="Phone" value={user?.ContactNo || "Not set"} />
            <InfoRow icon={<MapPin size={15} className="text-[#37B943]" />} label="Address" value={user?.Address || "Not set"} />
          </div>

          {/* Listings summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Activity</h2>
            <button
              onClick={() => navigate("/user/my-listings")}
              className="w-full flex items-center justify-between p-3 bg-[#f0fbf0] rounded-xl hover:bg-[#e2f8e4] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#37B943]/20 flex items-center justify-center">
                  <Package size={16} className="text-[#37B943]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">My Listings</p>
                  <p className="text-xs text-gray-500">View all your waste listings</p>
                </div>
              </div>
              <span className="text-[#37B943] text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => navigate("/user/sellingpage/sellscrap")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-base">♻️</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">Sell Waste</p>
                  <p className="text-xs text-gray-500">Create a new listing</p>
                </div>
              </div>
              <span className="text-gray-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Logout */}
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
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-all">{value || "—"}</p>
    </div>
  </div>
);

export default UserProfile;