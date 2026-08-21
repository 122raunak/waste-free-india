import React from "react";
import { X } from "lucide-react";

const VideoPopup = ({ onClose, content }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition"
        >
          <X size={16} className="text-white" />
        </button>

        {/* Video */}
        <div className="bg-black">
          <video
            src={content.video}
            controls
            autoPlay
            className="w-full max-h-[60vh] object-contain"
          />
        </div>

        {/* Title */}
        <div className="px-5 py-4">
          <h3 className="font-bold text-gray-900 text-lg">{content.alt}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Tap anywhere outside or press ✕ to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;