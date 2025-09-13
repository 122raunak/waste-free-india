import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo/logo.png";
import BottomNav from "../../components/BottomNav/BottomNav";
import ImageGrid from "../../components/HomeImg/ImageGrid";
import VideoPopup from "../../components/HomeImg/VideoPopup";
import Navbar from "../../components/Navbar/Navbar";
import { AppContext } from "../../context/AppContext";

function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const handleImageClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  return (
    // <div className="relative min-h-[100dvh] overflow-hidden bg-gray-100 font-sans">
    <>
      <div className="relative z-10 h-full overflow-y-auto pb-20 px-[20px] py-[10px]">
        <main className="text-center min-h-[100] flex flex-col items-center justify-center">
          <p className="text-xl text-black font-normal mb-8 mt-25">
            Click on the images to learn how to manage{" "}
            <span className="text-green-600">waste</span>
          </p>

          <ImageGrid onImageClick={handleImageClick} />

          <p className="text-black text-sm max-w-xl font-normal mx-auto leading-relaxed">
            Learn smart <span className="font-bold">waste management</span> with
            videos, an <span className="font-bold">AI chatbot</span> for your
            questions, and <span className="font-bold">fun games</span> that
            teach you how to handle waste.
          </p>
        </main>
      </div>

      {isPopupOpen && (
        <VideoPopup onClose={closePopup} content={popupContent} />
      )}
      {/* // </div> */}
    </>
  );
}

export default Home;
