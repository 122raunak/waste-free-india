import React from "react";
import logoimg from "../../../../public/Logo/logo.png"; // adjust path if needed

import { FiLogOut, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { IoIosStarHalf } from "react-icons/io";
import reportWaste from "../../../../public/Logo/Report Waste.png";
import recyclingPoint from "../../../../public/Logo/Recycling Points.png";
import { Link } from "react-router-dom";
function HamberMenu() {
  return (
    <>
      <div className="bg-white border-2 border-black w-[260px]  pt-6 rounded-tl-2xl rounded-bl-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logoimg} alt="logo" className="w-24 h-auto" />
        </div>

        <Link
          to={"/user/buyer/shop"}
          className="flex items-center gap-4 border-b-2 border-black py-3 px-5"
        >
          <FiShoppingBag className="text-green-600 text-4xl" />
          <h2 className="text-xl font-semibold text-gray-800">
            Recycling Shop
          </h2>
        </Link>

        <Link
          to="/user/leaderbord"
          className="flex items-center gap-4 border-b-2 border-black py-3 px-5"
        >
          <IoIosStarHalf className="text-green-600 text-4xl" />
          <h2 className="text-xl font-semibold text-gray-800">Leaderboard</h2>
        </Link>

        <Link
          to="/user/reportwaste"
          className="flex items-center gap-4 border-b-2 border-black py-3 px-5"
        >
          <div className="h-10 w-10">
            <img
              src={reportWaste}
              className="h-full w-full object-cover"
              alt="Report Waste"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Report Waste</h2>
        </Link>

        <Link
          to="/recyclingpoints"
          className="flex items-center gap-4 border-b-2 border-black py-3 px-5"
        >
          <div className="h-10 w-10">
            <img
              src={recyclingPoint}
              className="h-full w-full object-cover"
              alt="Recycling Points"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Recycling Points
          </h2>
        </Link>

        <div className="flex items-center gap-4 border-b-2 border-black py-3 px-5">
          <FiShoppingCart className="text-green-600 text-4xl" />
          <h2 className="text-xl font-semibold text-gray-800">Cart</h2>
        </div>

        <Link to="/user/logout" className="flex items-center gap-4 py-3 px-5">
          <FiLogOut className="text-red-600 text-4xl" />
          <h2 className="text-xl font-semibold text-red-600">Logout</h2>
        </Link>
      </div>
    </>
  );
}

export default HamberMenu;
