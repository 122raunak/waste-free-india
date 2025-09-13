import React from "react";

const VideoPopup = ({ onClose, content }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent Black Overlay */}
      <div
        className="absolute inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Popup Box */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl p-4 py-[20px] m-4 max-w-sm w-full">
        <div className="relative bg-white rounded-[9px] shadow-md overflow-hidden">
          <video
            src={content.video}
            controls
            autoPlay
            className="w-full h-auto"
          />
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black rounded-tl-[11px]" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-black rounded-tr-[11px]" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-black rounded-bl-[11px]" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black rounded-br-[11px]" />
        </div>

        <p className="text-center font-bold text-gray-800 text-lg mt-4">
          {content.alt}
        </p>
      </div>
    </div>
  );
};

export default VideoPopup;
