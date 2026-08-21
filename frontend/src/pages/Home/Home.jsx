import React, { useState } from "react";
import ImageGrid from "../../components/HomeImg/ImageGrid";
import VideoPopup from "../../components/HomeImg/VideoPopup";
import RotatingText from "../../components/Animation/RotatingText";

function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  return (
    <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center px-4 pt-6 pb-8">

      {/* Heading */}
      <p className="text-base md:text-lg text-gray-700 font-normal mb-5 text-center flex flex-wrap items-center justify-center gap-2">
        Click on the images to learn how to
        <span className="inline-flex items-center">
          <RotatingText
            texts={["Reduce", "Reuse", "Recycle", "Manage"]}
            mainClassName="px-3 py-0.5 bg-[#37B943] text-white rounded-lg overflow-hidden justify-center"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </span>
        <span className="font-semibold text-purple-500">Waste!</span>
      </p>

      {/* Grid */}
      <ImageGrid onImageClick={(content) => { setPopupContent(content); setIsPopupOpen(true); }} />

      {/* Footer text */}
      <p className="text-gray-400 text-xs md:text-sm text-center max-w-md mt-2 leading-relaxed">
        Learn smart <span className="font-semibold text-gray-600">waste management</span> with videos,
        an <span className="font-semibold text-gray-600">AI chatbot</span>, and{" "}
        <span className="font-semibold text-gray-600">fun games</span>.
      </p>

      {isPopupOpen && (
        <VideoPopup
          onClose={() => { setIsPopupOpen(false); setPopupContent(null); }}
          content={popupContent}
        />
      )}
    </div>
  );
}

export default Home;