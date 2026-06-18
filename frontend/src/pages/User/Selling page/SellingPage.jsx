import React, { useEffect, useRef, useState } from "react";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SCRAP_TYPES = [
  { emoji: "📄", title: "Paper", desc: "Newspapers, cardboard, books" },
  { emoji: "🥤", title: "Plastic", desc: "Bottles, containers, bags" },
  { emoji: "⚙️", title: "Metal", desc: "Iron, copper, aluminium" },
  { emoji: "💻", title: "E-waste", desc: "Electronics, batteries, cables" },
];

const RATES = [
  { item: "Metal", rate: "₹60 – ₹70", unit: "per kg" },
  { item: "Paper", rate: "₹20 – ₹30", unit: "per kg" },
  { item: "Plastic Bottles", rate: "₹5 – ₹15", unit: "per piece" },
  { item: "E-waste", rate: "₹100+", unit: "per kg" },
];

const SellingPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("Loading...");
  const tickerRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          { withCredentials: true }
        );
        setAddress(res.data.user?.Address || "Address not set — edit your profile");
      } catch {
        setAddress("Could not load address");
      }
    };
    fetch();
  }, []);

  useGSAP(() => {
    gsap.to(tickerRef.current, {
      color: "#37B943",
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-[#f5f5f5] pb-8">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#37B943] to-[#81E68D] px-5 pt-8 pb-14 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Sell Your Scrap
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-xs mx-auto">
          Your scrap, their livelihood — together for a cleaner India
        </p>
        <button
          onClick={() => navigate("/user/sellingpage/sellscrap")}
          className="mt-5 inline-flex items-center gap-2 bg-white text-[#37B943] font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all text-sm md:text-base"
        >
          List Waste Now <ArrowRight size={16} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-6">
        {/* Location card */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3 mb-6 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#e8f8ea] flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-[#37B943]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Your pickup location</p>
            <p className="text-sm text-gray-700 font-medium truncate">{address}</p>
          </div>
        </div>

        {/* Disclaimer ticker */}
        <p ref={tickerRef} className="text-xs text-center text-gray-500 mb-6 px-2">
          ⚠️ The final price is decided by the collector in person. Listed rates are approximate.
        </p>

        {/* Scrap type cards */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Types You Can Sell</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SCRAP_TYPES.map((s) => (
            <button
              key={s.title}
              onClick={() => navigate("/user/sellingpage/sellscrap")}
              className="bg-white rounded-xl p-4 text-left border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <span className="text-3xl mb-2 block">{s.emoji}</span>
              <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Current rates */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <TrendingUp size={15} className="text-[#37B943]" /> Current Market Rates
          </h2>
          <div className="divide-y divide-gray-100">
            {RATES.map((r) => (
              <div key={r.item} className="flex items-center justify-between py-3">
                <p className="text-sm text-gray-700 font-medium">{r.item}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#37B943]">{r.rate}</p>
                  <p className="text-xs text-gray-400">{r.unit}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            *Prices vary based on quality and market conditions.*
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellingPage;