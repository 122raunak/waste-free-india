import React, { useState } from "react";
import WasteItem from "../../../components/WasteItem/WasteItem";
import paper from "../../../../public/Found/newspaper.png";
import Navbar from "../../../components/Navbar/Navbar";
import profile from "../../../../public/Profile/profile.png";
import { X } from "lucide-react"; // ❌ icon

const Found = () => {
  const [showAll, setShowAll] = useState(true);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center mt-70 py-4 px-5 bg-white">
        {showAll ? (
          <div className="relative w-full flex flex-col items-center">
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-[-18px] right-[-14px] text-red-500 hover:text-red-500"
            >
              <X size={32} />
            </button>

            {/* Waste item card */}
            <WasteItem
              item={{
                id: 1,
                type: "Paper",
                quantity: 30,
                weight: "5KG",
                price: 500,
                imageSrc: paper,
                title: "Newspaper",
              }}
              showLearnMore={false}
            />

            {/* Buyer message */}
            <div className="px-4 py-3 w-full text-center font-sans">
              <p className="font-semibold">A buyer has been found.</p>
              <p>He will contact you soon to purchase your waste material.</p>
            </div>

            {/* Buyer profile */}
            <div className="flex flex-row justify-between w-[90%] mt-6 bg-gray-50 rounded-lg py-3 px-4 items-center shadow">
              <img
                src={profile}
                alt="profile"
                className="w-16 h-16 rounded-full border"
              />
              <div className="flex flex-col text-sm text-gray-700">
                <p>Name: Unknown</p>
                <p>Contact: Unknown</p>
                <p>Address: Unknown</p>
                <p>Other: Unknown</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-10 text-gray-500">❌ Cancelled</p>
        )}

        {/* Bottom nav stays always */}
        <Navbar />
      </div>
    </>
  );
};

export default Found;
