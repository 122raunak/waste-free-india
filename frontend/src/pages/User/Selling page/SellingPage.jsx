import React, { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import ewaste from "../../../../public/SellingPage/ewaste.png";
import plastic from "../../../../public/SellingPage/plastic.png";
import paper from "../../../../public/SellingPage/paper.png";
import metal from "../../../../public/SellingPage/metal.png";
import Button from "../../../components/Button/Button";
import ScrapCard from "../../../components/SellerPage/ScrapCard";
import Navbar from "../../../components/Navbar/Navbar";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SellingPage = () => {
  const [FormData, setFormData] = useState({
    address: "",
  });
  const dataref = useRef(null);
  useEffect(() => {
    const fetchLoggedInUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          { withCredentials: true }
        );

        const user = res.data.user;

        setFormData({
          address: user.Address || "NA",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLoggedInUserData();
  }, []);

  useGSAP(() => {
    gsap.from(dataref.current, {
      color: "red",
      duration: 0.7,
      repeat: -1,
      yoyo: true,
    });
  });
  return (
    <>
      <div className="min-h-[80%] w-full   py-6 px-4 flex flex-col items-center mt-10">
        <div
          ref={dataref}
          className=" text-black font-semibold px-4 py-2 text-[12px] text-center "
        >
          The garbage collector will decide the final price for your materials
          right in front of you. You can also see the current prices for
          different items listed below.
        </div>

        <div className="flex flex-col justify-center items-center w-full max-w-md z-50">
          <div className="flex border rounded-2xl px-4 py-2 w-full bg-white shadow-sm cursor-pointer justify-center items-center min-h-12">
            <MapPin size={30} color="#81E68D" />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  Your Location
                </span>
              </div>
              <p className="text-xs text-gray-500">{FormData.address}</p>
            </div>
          </div>

          <div>
            <div className=" w-[400px] overflow-y-auto max-h-[600px]  overflow-x-auto">
              <div className="flex flex-col items-center justify-center text-center p-4 w-full">
                <h2 className="text-2xl mt-8 font-bold">
                  SELL YOUR <span className="text-green-600">SCRAP NOW</span>
                </h2>
                <p className="text-lg text-gray-700">
                  Your scrap, their livelihood <br />
                  together for a cleaner India
                </p>
                <Button
                  text="Sell Now"
                  className="w-[150px] mt-3"
                  link="/user/sellingpage/sellscrap"
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center py-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 w-full flex items-center">
                  <span className="flex-grow border-t border-dashed border-black"></span>
                  <span className="mx-3">Types of Scrap You Can Sell</span>
                  <span className="flex-grow border-t border-dashed border-black"></span>
                </h2>
                <div className="w-full overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 px-4">
                    <ScrapCard image={plastic} title={"Plastic"} />
                    <ScrapCard image={paper} title={"Paper"} />
                    <ScrapCard image={ewaste} title={"E-Waste"} />
                    <ScrapCard image={metal} title={"Metal"} />
                  </div>
                </div>
              </div>
              <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 mx-auto my-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Current Rates
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Metal (per kg): ₹60 – ₹70</li>
                  <li>Paper (per kg): ₹20 – ₹30</li>
                  <li>
                    Plastic Bottle (per piece): ₹5 – ₹15, depending on the size
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  *Prices are approximate and may vary based on quality and
                  availability.*
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingPage;
