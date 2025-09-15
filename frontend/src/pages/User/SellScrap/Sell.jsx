import React from "react";
import { ChevronDown, Package, Droplet, Cog, Laptop } from "lucide-react";
import wastebin from "../../../../public/SellingPage/bin.png";
import InputField from "../../../Components/Input/InputField";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";

function SellScrap() {
  return (
    <div className="min-h-[100dvh] w-[90%]  relative overflow-hidden flex justify-center items-center flex-col top-[-70px]   ">
      {/* Main Content */}
      <div className="relative z-50  pt-[180px] ">
        {/* Top Section - Image and Waste Type */}
        <div className="flex  items-center justify-between gap-8 ">
          <div>
            <div className="flex-shrink-0 bg-white  w-38 h-30 md:w-40 md:h-40  rounded-lg  border border-black flex items-center justify-center p-4">
              <img
                src={wastebin}
                alt="Waste Bin"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Upload Button */}
            <button className="w-full  text-black border font-medium border-black mt-3  rounded-md  mb-4">
              Upload Image/File
            </button>
          </div>

          <div className="relative mt-[-100px]">
            <h2 className="p-2  font-medium">Waste Type:</h2>
            <div className="relative mt-1 ">
              <select
                id="waste-type"
                className="block w-full bg-white rounded-md   shadow-sm p-2 pr-10 text-sm appearance-none "
              >
                <option>Select Waste Type</option>
                <option>
                  {" "}
                  <span className="font-semibold">📦 Paper</span>
                </option>
                <option>
                  {" "}
                  <span className="font-semibold"> 🥤 Plastic</span>
                </option>
                <option>
                  {" "}
                  <span className="font-semibold"> ⚙️ Metal</span>
                </option>
                <option>
                  {" "}
                  <span className="font-semibold"> 💻 E-waste</span>
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-black-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="">
          <div className="flex flex-row justify-center items-center  mb-[-8px]">
            <h1 className="p-2 mt-[-20px] font-medium">Tilte:</h1>
            <InputField text="text" placeholder="Title" />
          </div>

          {/* Description Text Area with resize-none */}
          <div>
            <textarea
              id="description"
              className=" block w-full rounded-md border border-black p-2 text-sm resize-none bg-white"
              rows="2"
              placeholder="You can add your Waste description here"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1 ">
              <p className="font-medium">Weight (Optional):</p>
              <InputField type="number" placeholder="Enter Weight" />
            </div>
            <div className="flex flex-col gap-1 ">
              <p className="font-medium">Quantity:</p>
              <InputField type="number" placeholder="Enter Quantity" />
            </div>
          </div>
        </div>

        {/* Calculation and Sell buttons */}
        <div className="flex flex-col mb-6">
          <Button type="" text="Calculate Price" className="bg-yellow-400 hover:bg-[#eff381] transition duration-300 mb-4 " />
          <p className="mt-2 mb-[-4px] text-xs text-gray-500 text-center">
            Price will appear here after calculation
          </p>
        </div>

        <Button type="" text="Sell Waste" />
      </div>

      <Navbar/>
    </div>
  );
}

export default SellScrap;
