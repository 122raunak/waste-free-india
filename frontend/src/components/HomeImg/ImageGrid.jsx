import React from "react";

// images
import BioWasteimg from "../../assets/Home/Biowaste.png";
import recycleWaste from "../../assets/Home/recycleWaste.png";
import nonBioWaste from "../../assets/Home/nonBioWaste.png";
import whatIsWaste from "../../assets/Home/whatIsWaste.png";
import HazardousWasteimg from "../../assets/Home/Hazardouswaste.png";
import LiquidWasteimg from "../../assets/Home/Liquidwaste.png";
import SolidWasteimg from "../../assets/Home/Solidwaste.png";
import HowToManageWaste from "../../assets/Home/HowToManageWaste.png";

// video
import HouseHoldWaste from "../../../public/HomeVideos/HouseHoldWaste.mp4";
import bioWasteVideo from "../../../public/HomeVideos/nioWaste.mp4";
import nonBioWastevideo from "../../../public/HomeVideos/nonBioWaste.mp4";
import recycle from "../../../public/HomeVideos/recycle.mp4";
import wastemangementMethodVideo from "../../../public/HomeVideos/wastemangementMethod.mp4";
import whatIsWastevideo from "../../../public/HomeVideos/whatIsWaste.mp4";

const images = [
  {
    src: whatIsWaste,
    alt: "What is Waste",
    video: whatIsWastevideo,
  },
  {
    src: recycleWaste,
    alt: "How to Recycle Waste",
    video: recycle,
  },

  {
    src: BioWasteimg,
    alt: "Biodegradable Waste",
    video: bioWasteVideo,
  },
  {
    src: nonBioWaste,
    alt: "Non Biodegradable Waste",
    video: nonBioWastevideo,
  },
  {
    src: HowToManageWaste,
    alt: "How to manage Waste",
    video: wastemangementMethodVideo,
  },
];

const ImageGrid = ({ onImageClick }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4 mx-auto py-3 mb-8">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative bg-white rounded-[9px] shadow-md overflow-hidden cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto border border-black"
          />
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black rounded-tl-[10px]" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-black rounded-tr-[10px]" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-black rounded-bl-[10px]" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black rounded-br-[10px]" />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
