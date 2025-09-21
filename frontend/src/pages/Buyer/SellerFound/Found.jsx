import React, { useEffect, useState } from "react";
import WasteItem from "../../../components/WasteItem/WasteItem";
import profile from "../../../../public/Profile/profile.png";
import { X } from "lucide-react";
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
        setWasteData(res.data.wasteItem);
      } catch (error) {
        console.error(error);
      }
    };
    loadWasteItem();
  }, [id]);

  if (!wasteData)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );

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
    <div className="min-h-screen w-full flex items-center justify-center  px-4 py-8">
      {showAll ? (
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <button
            onClick={() => setShowAll(false)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
          >
            <X size={28} />
          </button>

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
            classname="shadow-none border-none"
          />

          <div className="mt-4 text-center">
            <p className="font-semibold text-lg text-gray-800">
              A buyer has been found
            </p>
            <p className="text-sm text-gray-600 mt-1">
              He will contact you soon to purchase your waste material.
            </p>
          </div>

          <div className="flex flex-row gap-4 items-center mt-6 w-full bg-gray-50 rounded-xl p-4 shadow">
            <img
              src={profileImgBase64}
              alt="profile"
              className="w-16 h-16 rounded-full border object-cover"
            />
            <div className="flex flex-col text-sm text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {`${wasteData.assignedBuyer?.FullName?.FirstName} ${wasteData.assignedBuyer?.FullName?.LasteName}`}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{" "}
                {wasteData.assignedBuyer?.ContactNo}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {wasteData.assignedBuyer?.Address}
              </p>
              <p>
                <span className="font-semibold">Business:</span>{" "}
                {wasteData.assignedBuyer?.BusinessName}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg">❌ Cancelled</p>
      )}
    </div>
  );
};

export default Found;
