import React, { useState } from "react";
import logo from "../../../public/Logo/logo.png";
import {MapPin , ChevronDown} from "lucide-react";
import ewaste from "../../../public/SellingPage/ewaste.png"
import plastic from "../../../public/SellingPage/plastic.png"
import paper from "../../../public/SellingPage/paper.png"
import metal from "../../../public/SellingPage/metal.png"
import Button from "../../Components/Button/Button";
import ScrapCard from "../../Components/SellerPage/ScrapCard";
import Navbar from "../../Components/Navbar/Navbar";



const SellingPage = () => {
  return (
    <>

      <div className="flex flex-col justify-center items-center w-[360px] z-50">

        {/* location wala */}
        <div className="flex border rounded-2xl px-4 py-2 w-full bg-white shadow-sm cursor-pointer justify-center items-center h-[48px]">
            <MapPin size={30} color="#81E68D"/>
            <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                    Your Location
                </span>
                <ChevronDown size={16} className="text-gray-600 ml-2" />
                </div>
                <p className="text-xs text-gray-500">Dummy Address</p>
            </div>
        </div>

        {/* text */}
        <div className="flex flex-col items-center justify-center text-center p-4  w-full">
            {/* Heading */}
            <h2 className="text-2xl mt-8 font-bold">
                SELL YOUR <span className="text-green-600">SCRAP NOW</span>
            </h2>

            {/* Subtext */}
            <p className="text-lg text-gray-700 ">
                Your scrap, their livelihood <br />
                together for a cleaner India
            </p>

            <Button text="Sell Now" className="w-[150px] mt-3"/>
        </div>


        {/* items selection */}
       <div className="w-full flex flex-col items-center justify-center py-8">
      
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 w-full flex items-center">
            <span className="flex-grow border-t border-dashed border-black"></span>
            <span className="mx-3">Types of Scrap You Can Sell</span>
            <span className="flex-grow border-t border-dashed border-black"></span>
        </h2>

        {/* Horizontal Scroll Container */}
            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 px-4">
                    {/* Scrap Cards */}
                    <ScrapCard image={plastic} title={"Plastic"}/>
                    <ScrapCard image={paper} title={"Paper"}/>
                    <ScrapCard image={ewaste} title={"E-Waste"}/>
                    <ScrapCard image={metal} title={"Metal"}/>
                    <ScrapCard image={metal} title={"Metal"}/>
                    <ScrapCard image={metal} title={"Metal"}/>
                    <ScrapCard image={metal} title={"Metal"}/>
                    <ScrapCard image={metal} title={"Metal"}/>
                </div>
            </div>
        </div>
      </div>
      
    <Navbar/>

      
    </>
  );
};

export default SellingPage;