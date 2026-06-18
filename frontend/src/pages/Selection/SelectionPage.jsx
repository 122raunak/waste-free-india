import React from "react";
import { useNavigate } from "react-router-dom";
import { Recycle, ShoppingBag, ArrowRight } from "lucide-react";

const SelectionPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: "♻️",
      role: "Scrap Seller",
      desc: "List your waste materials and connect with buyers near you.",
      color: "border-[#37B943] hover:bg-[#f0fbf0]",
      accent: "bg-[#37B943]",
      link: "/user/login",
    },
    {
      icon: "🏭",
      role: "Scrap Buyer",
      desc: "Browse waste listings and grow your recycling business.",
      color: "border-[#2196F3] hover:bg-[#f0f7ff]",
      accent: "bg-[#2196F3]",
      link: "/buyer/login",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] flex flex-col items-center justify-center px-5 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">♻️</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome!</h1>
        <p className="text-gray-500 text-base md:text-lg">Select your account type to continue</p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <button
            key={c.role}
            onClick={() => navigate(c.link)}
            className={`group w-full bg-white border-2 ${c.color} rounded-2xl p-6 md:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-md flex flex-col gap-3`}
          >
            <span className="text-4xl">{c.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{c.role}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
            <div className={`mt-2 self-start flex items-center gap-2 ${c.accent} text-white text-sm font-medium px-4 py-2 rounded-xl group-hover:gap-3 transition-all`}>
              Get Started <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">WasteFreeIndia · Making India cleaner</p>
    </div>
  );
};

export default SelectionPage;