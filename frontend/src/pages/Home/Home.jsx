import React, { useState } from "react";
import ImageGrid from "../../components/HomeImg/ImageGrid";
import VideoPopup from "../../components/HomeImg/VideoPopup";
import RotatingText from "../../components/Animation/RotatingText";

function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const handleImageClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-[#f5f5f5]">
      {/* Hero text */}
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-4 text-center">
        <p className="text-base md:text-lg text-gray-700 font-normal mb-6">
          Click on the images to learn how to{" "}
          <span className="inline-flex items-center">
            <RotatingText
              texts={["Reduce", "Reuse", "Recycle", "Manage"]}
              mainClassName="px-2 py-0.5 bg-green-400 text-white rounded-lg overflow-hidden justify-center"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </span>{" "}
          <span className="font-semibold text-purple-500 ml-1">Waste!</span>
        </p>

        {/* Image grid fills naturally, centered */}
        <ImageGrid onImageClick={handleImageClick} />

        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mt-6">
          Learn smart <span className="font-semibold text-gray-700">waste management</span> with videos,
          an <span className="font-semibold text-gray-700">AI chatbot</span>, and{" "}
          <span className="font-semibold text-gray-700">fun games</span>.
        </p>
      </div>

      {isPopupOpen && <VideoPopup onClose={() => { setIsPopupOpen(false); setPopupContent(null); }} content={popupContent} />}
    </div>
  );
}

export default Home;