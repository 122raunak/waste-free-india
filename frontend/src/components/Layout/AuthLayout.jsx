import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Shared auth shell.
 * Mobile  → single column, centred card
 * Desktop → left branded panel + right white form (50/50)
 *
 * Props:
 *   role     "user" | "buyer"
 *   children  the form JSX
 */
const AuthLayout = ({ children, role = "user" }) => {
  const navigate = useNavigate();
  const isUser = role === "user";

  const stats = isUser
    ? [["10K+", "Sellers"], ["₹2Cr+", "Earned"], ["4", "Waste Types"]]
    : [["5K+", "Buyers"], ["50+", "Cities"], ["Daily", "Listings"]];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">

      {/* ── Left brand panel — desktop only ── */}
      <div
        className={`hidden md:flex md:w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden
          ${isUser
            ? "bg-gradient-to-br from-[#37B943] to-[#81E68D]"
            : "bg-gradient-to-br from-[#1976D2] to-[#64B5F6]"
          }`}
      >
        {/* decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 -right-20 w-48 h-48 rounded-full bg-white/5" />

        {/* headline */}
        <div className="relative z-10 text-center max-w-xs">
          <div className="text-5xl mb-6">♻️</div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            {isUser ? "Turn scrap into income." : "Buy smart. Recycle smarter."}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            {isUser
              ? "Join thousands of sellers turning waste into money while keeping India clean."
              : "Connect with sellers across India and grow your sustainable recycling business."}
          </p>
        </div>

        {/* stats */}
        <div className="flex gap-8 mt-10 relative z-10">
          {stats.map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-white text-xl font-bold">{val}</p>
              <p className="text-white/70 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* brand name */}
        <p className="absolute bottom-6 text-white/50 text-xs tracking-widest uppercase z-10">
          WasteFreeIndia
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col px-6 py-8 md:px-14 bg-white min-h-screen md:min-h-0">

        {/* ── Back to home button — top left of form panel ── */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft size={15} />
            </span>
            <span>Back to home</span>
          </button>
        </div>

        {/* mobile logo — shown below the back button on small screens */}
        <div className="flex flex-col items-center mb-6 md:hidden">
          <div className="text-4xl mb-2">♻️</div>
          <p className="text-xs text-gray-400 tracking-widest uppercase">WasteFreeIndia</p>
        </div>

        {/* form content — centred in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;