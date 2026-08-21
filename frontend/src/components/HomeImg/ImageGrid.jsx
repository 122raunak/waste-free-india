import React from "react";

// ✅ Images from src/assets — can be imported normally
import BioWasteimg from "../../assets/Home/Biowaste.png";
import recycleWaste from "../../assets/Home/recycleWaste.png";
import nonBioWaste from "../../assets/Home/nonBioWaste.png";
import whatIsWaste from "../../assets/Home/whatIsWaste.png";
import HowToManageWaste from "../../assets/Home/HowToManageWaste.png";

const images = [
  {
    src: whatIsWaste,
    alt: "What is Waste",
    video: "/HomeVideos/whatIsWaste.mp4",
  },
  {
    src: recycleWaste,
    alt: "How to Recycle Waste",
    video: "/HomeVideos/recycle.mp4",
  },
  {
    src: BioWasteimg,
    alt: "Biodegradable Waste",
    video: "/HomeVideos/nioWaste.mp4",
  },
  {
    src: nonBioWaste,
    alt: "Non-Biodegradable Waste",
    video: "/HomeVideos/nonBioWaste.mp4",
  },
  {
    src: HowToManageWaste,
    alt: "How to Manage Waste",
    video: "/HomeVideos/wastemangementMethod.mp4",
  },
];

const Card = ({ image, onImageClick }) => (
  <div
    onClick={() => onImageClick(image)}
    className="relative group rounded-xl overflow-hidden cursor-pointer shadow-md
      border-2 border-transparent hover:border-[#37B943]
      hover:shadow-xl hover:-translate-y-1 active:scale-[0.97]
      transition-all duration-200 bg-white w-full h-full"
  >
    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />

    {/* Play overlay on hover */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
        <span className="text-[#37B943] text-xl ml-1">▶</span>
      </div>
    </div>

    {/* Label slides up on hover */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
      <p className="text-white text-xs font-semibold text-center leading-tight">{image.alt}</p>
    </div>
  </div>
);

const ImageGrid = ({ onImageClick }) => (
  <>
    {/* ── MOBILE: horizontal snap scroll, one card at a time ── */}
    <div className="md:hidden w-full">
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image, i) => (
          <div key={i} className="snap-center shrink-0 w-[78vw] max-w-[280px] aspect-[4/3]">
            <Card image={image} onImageClick={onImageClick} />
          </div>
        ))}
      </div>

      {/* Hint text */}
      <p className="text-center text-xs text-gray-400 mt-2">
        ← Swipe to see all {images.length} topics →
      </p>
    </div>

    {/* ── DESKTOP: 3 top + 2 bottom ── */}
    <div className="hidden md:block w-full max-w-4xl mx-auto px-4">
      {/* Row 1 — 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {images.slice(0, 3).map((image, i) => (
          <div key={i} className="aspect-[4/3]">
            <Card image={image} onImageClick={onImageClick} />
          </div>
        ))}
      </div>
      {/* Row 2 — 2 wider cards */}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(3).map((image, i) => (
          <div key={i + 3} className="aspect-[16/9]">
            <Card image={image} onImageClick={onImageClick} />
          </div>
        ))}
      </div>
    </div>
  </>
);

export default ImageGrid;