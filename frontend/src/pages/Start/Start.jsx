import React from "react";
import Button from "../../components/Fields/Button";
import { useNavigate } from "react-router-dom";
import start from "../../assets/startpage.png";
import startvideo from "../../../public/Vidoe/Waste Management Commercial.publer.com.mp4";
import logo from "../../assets/logo/logo.png";
import SvgBtn from "../../components/Animation/SvgButton";

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
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* overlay addded */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      <div className="text-right w-full mt-40 relative z-20 ">
        <p className="font-semibold text-[20px] text-lime-300 ">Welcome to</p>
        <h1
          className="font-bold text-[48px] text-white transition-colors duration-500 hover:text-green-400"
          // style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          WasteFreeIndia
        </h1>
      </div>

      <div
        className="relative top-[-180px] w-full font-extrabold text-[20px] mb-6 z-20 "
        onClick={handleStartClick}
      >
        {/* <Button text="Get started" /> */}
        <SvgBtn />
        {/* <button className="btn-donate">Get started</button> */}
      </div>
    </div>
  );
};

export default Start;
