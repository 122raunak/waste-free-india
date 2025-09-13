import React from "react";
import Button from "../../components/Fields/Button";
import { useNavigate } from "react-router-dom";
import start from "../../assets/startpage.png";
import startvideo from "../../../public/Vidoe/Waste Management Commercial.publer.com.mp4";
import logo from "../../assets/logo/logo.png";
import TextType from "../../components/Animation/TextType";

const Start = () => {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate("/user/home");
  };
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden px-[20px] py-[10px]">
      <video
        src={startvideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-30"
      />

      <div className="text-right w-full mt-40 relative z-31">
        <p className="font-semibold text-[20px] text-lime-300">Welcome to</p>
        <h1 className="mt-2 font-bold text-white text-[48px] ">
          WasteFreeIndia
        </h1>
      </div>

      {/* Button */}
      <div
        className="relative top-[-180px] w-full font-extrabold text-[20px] mb-6 z-31"
        onClick={handleStartClick}
      >
        <Button text="Get started" />
      </div>
    </div>
  );
};

export default Start;
