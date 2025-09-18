import React, { useEffect, useState } from "react";
import WasteItem from "../../../components/WasteItem/WasteItem";
import paper from "../../../../public/Found/newspaper.png";
import Navbar from "../../../components/Navbar/Navbar";
import profile from "../../../../public/Profile/profile.png";
import { X } from "lucide-react"; // ❌ icon
import axios from "axios";
import { useParams } from "react-router-dom";

const Found = () => {
  const { id } = useParams();
  const [showAll, setShowAll] = useState(true);
  const [wasteData, setWasteData] = useState(null);

  useEffect(() => {
    const loadWasteItem = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/Scrap/show/${id}/confirm/found`,
          { withCredentials: true }
        );
        console.log(res.data.wasteItem);

        setWasteData(res.data.wasteItem);
      } catch (error) {
        console.error(error);
      }
    };
    loadWasteItem();
  }, [id]);

  if (!wasteData) return <p>Loading...</p>;

  let profileImgBase64 = profile;
  if (
    wasteData.assignedBuyer?.profileImg &&
    wasteData.assignedBuyer?.profileImg.data
  ) {
    const binary = new Uint8Array(wasteData.assignedBuyer?.profileImg.data);
    const base64String = btoa(
      binary.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
    );
    profileImgBase64 = `data:image/jpeg;base64,${base64String}`;
  }

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
                id: wasteData._id,
                type: wasteData.category,
                quantity: wasteData.quantity,
                weight: wasteData.weight,
                estimatedPrice: wasteData.estimatedPrice,
                images: wasteData.images,
              }}
              showLearnMore={false}
            />

            {/* Buyer message */}
            <div className="px-4 py-3 w-full text-center font-sans">
              <p className="font-semibold">A buyer has been found.</p>
              <p>He will contact you soon to purchase your waste material.</p>
            </div>

            {/* Buyer profile */}
            <div className="flex flex-row justify-between w-[90%] mt-6 bg-gray-50 rounded-lg py-3 px-4 items-center shadow ">
              <img
                src={profileImgBase64}
                alt="profile"
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div className="flex flex-col text-sm text-gray-700">
                <p>
                  Name:{" "}
                  {`${wasteData.assignedBuyer?.FullName?.FirstName} ${wasteData.assignedBuyer?.FullName?.LasteName}`}
                </p>
                <p>Contact: {wasteData.assignedBuyer?.ContactNo}</p>
                <p>Address: {wasteData.assignedBuyer?.Address}</p>
                <p>BusinessName: {wasteData.assignedBuyer?.BusinessName}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-10 text-gray-500">❌ Cancelled</p>
        )}
      </div>
    </>
  );
};

export default Found;
