import React from "react";
import { useNavigate } from "react-router-dom";
import startvideo from "../../../public/Vidoe/Waste Management Commercial.publer.com.mp4";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden">
      {/* Background video */}
      <video
        src={startvideo}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center flex-1 w-full px-6 text-center py-16">
        {/* Brand */}
        <div className="mb-8">
          <span className="text-5xl md:text-6xl">♻️</span>
        </div>
        <p className="text-lime-300 font-semibold text-lg md:text-xl tracking-wide mb-2">Welcome to</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          WasteFree<span className="text-[#81E68D]">India</span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-xs md:max-w-sm leading-relaxed mb-12">
          Connect sellers and buyers of recyclable waste. Turn your scrap into income.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm">
          <button
            onClick={() => navigate("/user/selection")}
            className="flex-1 h-12 bg-[#37B943] hover:bg-[#2ea038] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition-all text-base"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/user/home")}
            className="flex-1 h-12 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm transition-all text-base"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-20 pb-6 text-center">
        <p className="text-white/40 text-xs tracking-widest uppercase">Making India Cleaner · One Pickup at a Time</p>
      </div>
    </div>
  );
};

export default Start;